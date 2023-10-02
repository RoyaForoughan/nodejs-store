const path = require('path')
const { createProductSchema } = require("../../validators/admin/produc.schema");
const Controller = require("../Controller");
const { deleteFileInPublic } = require("../../../utils/functions");
const { ProductModel } = require("../../../models/products");

class ProductController extends Controller{
    async addProduct(req,res,next){
        try {
            const productBody = await createProductSchema.validateAsync(req.body)
            req.body.image = path.join(productBody.fileUploadPath , productBody.filename) 
            const image = req.body.image.replace(/\\/g , '/')
            
            const {title , text , short_text , category , tags , count , price , discount, width , height , weight , length } = productBody
            const supplier = req.user._id

            let feature = {} , type = 'physical'
            if(width || height || length || weight ){

                if(!width) feature.width = 0
                else feature.width = width
                if(!height) feature.height = 0
                else feature.height = height
                if(!length) feature.length = 0
                else feature.length = length
                if(!weight) feature.weight = 0
                else feature.weight = weight
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
                image , 
                feature,
                supplier,
                type
            })
            return res.status(201).json({
                data:{
                    statusCode : 201 , 
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
            const products = await ProductModel.find({})
            return res.status(200).json({
                data:{
                    statusCode:200,
                    products
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