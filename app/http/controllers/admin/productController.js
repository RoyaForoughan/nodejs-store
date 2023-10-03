const path = require('path')
const { createProductSchema } = require("../../validators/admin/produc.schema");
const Controller = require("../Controller");
const { deleteFileInPublic, ListOfImagesFromRequest } = require("../../../utils/functions");
const { ProductModel } = require("../../../models/products");
const { ObjectIdValidator } = require('../../validators/public.validator');
const createError = require('http-errors')
const {StatusCodes : HttpStatus} = require('http-status-codes')

class ProductController extends Controller{
    async addProduct(req,res,next){
        try {
            const images = ListOfImagesFromRequest(req?.files || [] , req.body.fileUploadPath)
            const productBody = await createProductSchema.validateAsync(req.body)
        
            
            const {title , text , short_text , category , tags , count , price , discount, width , height , weight , length } = productBody
            const supplier = req.user._id

            let feature = {} , type = 'physical'
            if(isNaN(+width) || isNaN(+height) || isNaN(+length) || isNaN(+weight) ){

                if(!width) feature.width = 0
                else feature.width = +width
                if(!height) feature.height = 0
                else feature.height = +height
                if(!length) feature.length = 0
                else feature.length = +length
                if(!weight) feature.weight = 0
                else feature.weight = +weight
            }else{
                type = 'virtual'
            }
            const product = await ProductModel.create({
                title,
                text,
                short_text,
                category,
                tags,
                count,
                price,
                discount,
                images , 
                feature,
                supplier,
                type
            })
            return res.status(HttpStatus.CREATED).json({
                data:{
                    statusCode : HttpStatus.CREATED , 
                    message : 'ثبت محصول با موفقیت انجام شد',
                    product
                }
            })
        } catch (error) {
            deleteFileInPublic(req.body.image)
            next(error)
        }
    }
    async getAllProducts(req,res,next){
        try {
            const search = req?.query?.search || ''
            let products 
             if(search){
                products = await ProductModel.find({
                    $text:{
                        $search: new RegExp(search , 'ig')
                    }
                 })
             }else{
                products = await ProductModel.find({})
             }
            return res.status(HttpStatus.OK).json({
                data:{
                    statusCode:HttpStatus.OK,
                    products
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async getOneProduct(req,res,next){
        try {
            const {id} = req.params
            const product = await this.findProductById(id)
            return res.status(HttpStatus.OK).json({
                data:{
                    statusCode:HttpStatus.OK , 
                    product
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async removeProductById(req,res,next){
        try {
            const {id} = req.params
            const product = await this.findProductById(id)
            const removeProduct = await ProductModel.deleteOne({_id : product._id})
            if(removeProduct.deletedCount == 0) throw createError.InternalServerError()
            return res.status(HttpStatus.OK).json({
                data:{
                    statusCode:HttpStatus.OK , 
                    message:'حذف با موفقیت انجام شد'
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async findProductById(productId){
        const {id} = await ObjectIdValidator.validateAsync({id : productId})
        const product = await ProductModel.findById(id)
        if(!product) throw createError.NotFound('محصولی یافت نشد')
        return product
    }

    
}

module.exports = {
    ProductController : new ProductController()
}