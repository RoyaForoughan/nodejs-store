const createError = require("http-errors");
const { authSchima } = require("../../validators/user/authSchima");
const Controller = require("../controller");

module.exports = new class HomeController extends Controller{
    async indexPage(req,res,next){
        try {
            return res.status(200).send('Index page store')
        } catch (error) {
            next(error)
        }
    }
}