const app = require("../app");
const { update } = require("../models/user.model");

module.exports = (app) => {
    const users = require('../controllers/user.controller')
    const authenticationControllers = require('../controllers/auth.controller')
  
    app
      .route('/api/users')
      .get(authenticationControllers.isSuperuser(), users.list)
      .post(authenticationControllers.isSuperuser(), users.create)
    app.route('/api/users/login').post(users.login)
    // app.route('/api/users/change-pass').put(users.changePass)
    app
      .route('/api/users/:email')
    //   .get(users.read)
      .delete(authenticationControllers.isSuperuser(), users.delete)
      .put(authenticationControllers.isSuperuser(), users.update)
    app.param('email', users.userByEmail)
  }