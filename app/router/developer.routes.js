const router = require('express').Router()
const bcrypt = require('bcrypt')
const { RandomNumberGenerator } = require('../utils/functions')
router.get('/hash-password/:password' , (req,res,next)=>{
    const {password} = req.params
    const salt = bcrypt.genSaltSync(10)
    return res.send(bcrypt.hashSync(password , salt))
})

router.get('/random-number' , (req,res,next) => {
    return res.send(RandomNumberGenerator().toString())
})

module.exports = {
    DeveloperRoutes : router
}