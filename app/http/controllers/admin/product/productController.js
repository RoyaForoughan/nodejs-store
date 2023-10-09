const path = require('path')
const { createProductSchema } = require("../../../validators/admin/produc.schema");
const Controller = require("../../Controller");
const { deleteFileInPublic, ListOfImagesFromRequest, setFeatures, copyObject, deleteInvalidPropertyInObject } = require("../../../../utils/functions");
const { ProductModel } = require("../../../../models/products");
const { ObjectIdValidator } = require('../../../validators/public.validator');
const createError = require('http-errors')
const {StatusCodes : HttpStatus} = require('http-status-codes')
const ProductBlackList = {
    BOOKMARKS: "bookmarks",
    LIKES: "likes",
    DISLIKES: "dislikes",
    COMMENTS: "comments",
    SUPPLIER: "supplier",
    WEIGHT: "weight",
    WIDTH: "width",
    LENGTH: "length",
    HEIGHT: "height",
    COLORS: "colors"
  }

class ProductController extends Controller{
    async addProduct(req,res,next){
        try {
            const images = ListOfImagesFromRequest(req?.files || [] , req.body.fileUploadPath)
            const productBody = await createProductSchema.validateAsync(req.body)
        
            
            const {title , text , short_text , category , tags , count , price , discount} = productBody
            const supplier = req.user._id
            let features = setFeatures(req.body)
          
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
                features,
                supplier,
                type
            })
            return res.status(HttpStatus.CREATED).json({
                statusCode : HttpStatus.CREATED , 
                data:{
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
                statusCode:HttpStatus.OK,
                data:{
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
                statusCode:HttpStatus.OK , 
                data:{
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
                statusCode:HttpStatus.OK , 
                data:{
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

    async editProduct(req,res,next){
        try {
            const {id} = req.query
            const product = await this.findProductById(id)
           const data = copyObject(req.body) 
           data.images = ListOfImagesFromRequest(req?.files || [] , req.body.fileUploadPath)
           data.features = setFeatures(req.body)
          
          let blackListFeild = Object.values(ProductBlackList)
          deleteInvalidPropertyInObject(data , blackListFeild)
           const updateResult = await ProductModel.updateOne({_id : product._id} , {$set:data})
           if(updateResult.modifiedCount == 0) throw {status: HttpStatus.INTERNAL_SERVER_ERROR , message:'خطای داخلی'}
           return res.status(HttpStatus.OK).json({
               statusCode:HttpStatus.OK,
            data:{
                message:'به روز رسانی با موفقییت انجام شد'
            }
           })
        } catch (error) {
            next(error)
        }
    }

    
}

module.exports = {
    ProductController : new ProductController()
}