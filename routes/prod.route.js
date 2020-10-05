const { post } = require("../app");
const app = require("../app");

module.exports = (app) =>{
    const prod = require('../controllers/product.controller')
    const authenticationController = require('../controllers/auth.controller')

    app
        .route('/api/product')
        .get(prod.list)
        .post(prod.create)
    app
        .route('/api/product/:id')
        .delete(authenticationController.isSuperuser(), prod.delete)
        .put(authenticationController.isSuperuser(), prod.update) //Cac ham hay activities lien quan den param truyen vao thi can dat Route trong param
    app.param('id', prod.prodByID)
}       