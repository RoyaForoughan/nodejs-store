const { CategoryModel } = require("../../../models/categories")
const { addCategorySchima, updateCategorySchima } = require("../../validators/admin/categorySchima")
const createError = require('http-errors')

const mongoose = require('mongoose')
const Controller = require("../Controller")
class CategoryController extends Controller {
    async addCategory(req,res,next){
        try {
            addCategorySchima.validateAsync()
            const {title , parent} = req.body
            const category = await CategoryModel.create({title,parent})
            if(!category) throw createError.InternalServerError('خطای داخلی')
            return res.status(201).json({
                data:{
                    statusCode:201,
                    message:'دسته بندی با موفقیت افزوده شد'
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async removeCategory(req,res,next){
        try {
            const {id} = req.params
            const category = await this.checkExistCategory(id)   ;
            const deletedCategory = await CategoryModel.deleteMany({
                $or:[
                    {_id: category._id},
                    {parent : category._id}
                ]
            })
            if(deletedCategory.deletedCount == 0) throw createError.InternalServerError('حذف دسته بندی انجام نشد')
            return res.status(200).json({
                data:{
                    statusCode:200,
                    message: 'حذف دسته بند انجام شد'
                }
            })
        } catch (error) {
            next(error)
        }
    }

   async getCategoryById(req,res,next){
    try {
        const { id: _id } = req.params;
        const category = await CategoryModel.aggregate([
          {
            $match: { _id: new mongoose.Types.ObjectId(_id) },
        },
        {
            $lookup: {
                from: "categories",
                localField: "_id",
                foreignField: "parent",
                as: "children",
            },
        },
        {
            $project: {
                __v: 0,
                "children.__v": 0,
                "children.parent": 0,
            },
        },
    ]);
        return res.status(200).json({
          statusCode: 200,
          data: {
            category,
          },
        });
      } catch (error) {
        next(error);
      }
    }

    // async getAllCategory(req,res,next){
    //     try {
    //         // const category = await CategoryModel.aggregate([
    //         //     {
    //         //         $lookup:{
    //         //             from:'categories',
    //         //             localField:'_id',
    //         //             foreignField:'parent',
    //         //             as:'children'
    //         //         }
    //         //     },{
    //         //         $project:{
    //         //             __v:0,
    //         //             'children.__v':0,
    //         //             'children.parent':0
    //         //         }
    //         //     },{
    //         //         $match:{
    //         //             parent:undefined
    //         //         }
    //         //     }
    //         // ])
    //         // return res.status(200).json({
    //         //     data:{
    //         //         category
    //         //     }
    //         // })


    //         const categories = await CategoryModel.aggregate([
    //             {
    //                 $graphLookup:{
    //                     from:'categories',
    //                     startWith: '$id',
    //                     connectFromField:'_id',
    //                     connectToField:'parent',
    //                     maxDepth:5,
    //                     depthField:'depth',
    //                     as:'children'
    //                 }
    //             },{
    //                 $project:{
    //                     __v:0,
    //                     'children.__v':0,
    //                     'children.parent':0
    //                 }
    //             },{
    //                 $match:{
    //                     parent:undefined
    //                 }
    //             }
    //         ])
    //         return res.status(200).json({
    //             data:{
    //                 categories
    //             }
    //         })
    //     } catch (error) {
    //         next(error)
    //     }
    // }

    async getAllCategory(req,res,next){
        try {
            const categories = await CategoryModel.find({parent: undefined} , {__v : 0})
        return res.status(200).json({
            data:{
                statusCode:200 , 
                categories
            }
        })
        } catch (error) {
            next(error)
        }
    }

    async getChildOfParents(req,res,next){
        try {
            const {parent} = req.params
            const children = await CategoryModel.find({parent})
            return res.status(200).json({
                data:{
                    statusCode:200,
                    children
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async getAllCategoryWhitoutPopulate(req,res,next){
        try {
            const categories = await CategoryModel.aggregate([[{ $match: {} }]])
        return res.status(200).json({
            data:{
                categories
            }
        })
        } catch (error) {
            next(error)
        }
    }

    async getAllParents(req,res,next){
        try {
            const parents = await CategoryModel.find({parent : undefined}, {__v:0})
            return res.status(200).json({
                data : {
                    statusCode:200,
                    parents
                }
            })
            
        } catch (error) {
            next(error)
        }
    }

    async editCategoryTitle(req,res,next){
        try {
            const {id} = req.params
            const {title} = req.body
            await this.checkExistCategory(id)
            await updateCategorySchima.validateAsync(req.body)

            const resultUpdate = await CategoryModel.updateOne(
                { _id: id },
                { $set: {title} }
            );

            if(resultUpdate.modifiedCount == 0 ) throw createError.InternalServerError('به روز رسانی انجام نشد')
            return res.status(200).json({
                data:{
                        statusCode:200, 
                        message:'به روز رسانی با موفقیت انجام شد'
                    }
                })
        } catch (error) {
            next()
        }
    }

    async checkExistCategory(id){
        const category = await CategoryModel.findById(id)
        if(!category) throw createError.NotFound('دسته بندی یافت نشد')
        return category
    }
}


module.exports = {
    CategoryController : new CategoryController()
}