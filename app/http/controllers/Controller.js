//const autoBind = (...args) => import('auto-bind').then(({default: autoBind}) => autoBind(...args));
const autoBind = require("auto-bind");


module.exports = class Controller{
    constructor(){
        autoBind(this)
    }
}

