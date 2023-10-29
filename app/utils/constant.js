module.exports = {
    MongoIDPattern : /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i ,
    ROLES : Object.freeze({
        USER : "USER",
        ADMIN : "ADMIN",
        WRITER : "WRITER",
        TEACHER : "TEACHER",
        SUPPLIER : "SUPPLIER"
    }),
    PERMISSIONS : Object.freeze({
        USER : ["profile"],
        ADMIN : ["all"],
        SUPERADMIN : ["all"],
        CONTENT_MANAGER :[ "course", "blog", "category", "product"],
        TEACHER :[ "course", "blog"],
        SUPPLIER : ["product"],
        ALL : "all"
    }),
    ACCESS_TOKEN_SECRET_KEY : 'D716A3ED602058898E98D607498BCF53AD57C24A161B09FD8EDAE59EF7CF9CDB',
    REFRESH_TOKEN_SECRET_KEY : '9AB6D41276B0550C72576D090A9B1F1D391083483CACFC81BF0FFAA2C4B8F398'
}

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2JpbGUiOiIwOTAxNDMwNDY0MSIsImlhdCI6MTY5NTEzMjI4MCwiZXhwIjoxNjk1MTM1ODgwfQ.rAptXYY67FnoWy-FC_zLLgfNX10m5jCx9K3rL41AhdM