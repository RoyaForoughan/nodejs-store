const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const createError = require('http-errors')
const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')
const cors = require('cors')
const { AllRoutes } = require('./router/router')
const morgan = require('morgan')
module.exports = class Application {
    #app = express()
    #PORT
    #DB_URL
    constructor(PORT , DB_URL){
        this.#PORT = PORT
        this.#DB_URL = DB_URL
        this.configApplication()
       // this.initRedis()
        this.connectToMongoDB()
        this.createServer()
        this.createRoutes()
        this.errorHandling()
    }

    // initRedis(){
    //     require('./utils/init_redis')
    // }

    configApplication(){
        this.#app.use(cors())
        this.#app.use(morgan('dev'))
        this.#app.use(express.json())
        this.#app.use(express.urlencoded({extends:true}))
        this.#app.use(express.static(path.join(__dirname, '..' , 'public')))
        this.#app.use('/api-doc' , swaggerUI.serve , swaggerUI.setup(swaggerJsDoc({
            swaggerDefinition:{
                info:{
                    title:'Roya Store',
                    version:'2.0.0',
                    description:'فروشگاه تستی',
                    contact:{
                        name:'Roya',
                        url:'https://freerealapi.com',
                        email:'roya@gmail.com'
                    }
                },
                servers : [{
                    url:'http://localhost:5000'
                }]
            },
            apis:['./app/router/**/*.js']
        })))
    }
    createServer(){
        const http = require('http')
        http.createServer(this.#app).listen(this.#PORT , () => {
            console.log('run > http://localhost:' + this.#PORT);
        })
    }

    connectToMongoDB(){
        mongoose.connect(this.#DB_URL)
        .then(() => console.log('Connect to mongoDB'))
        .catch((error) => console.log(error.message))

        mongoose.connection.on('connected' , () => {
            console.log('mongoose connected to DB');
        })

        mongoose.connection.on('disconnected' , () => {
            console.log('mongoose connection is disconnected');
        })

        mongoose.connection.on('SIGINT' ,async ()=>{
            await mongoose.connection.close()
            console.log('disconnected');
            process.exit(0)

        })
        // mongoose.connect(this.#DB_URL , (error) => {
        //     if(!error) return console.log('Connect to mongoDB');
        //     return console.log('Faild to connected to mongoDB');
        // })
    }
    createRoutes(){
        this.#app.use(AllRoutes)
    }

    errorHandling(){
        this.#app.use((req,res,next) => {     
            next(createError.NotFound('صفحه مورد نظر یافت نشد'))
        })
        this.#app.use((error , req,res,next) => {
            const serverError = createError.InternalServerError()
            const statusCode = error.status || serverError.status
            const message = error.message || serverError.message
            return res.status(statusCode).json({
                errors:{
                    statusCode , 
                    message
                }
            })
        })
    }
}