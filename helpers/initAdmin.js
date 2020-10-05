const USER = require('../models/user.model')
const bcrypt = require('bcrypt')

exports.initAdmin = async () => {
    let user =  await USER.findOne({ email: "admin@gmail.com" })

    if(!user){
        user = new USER({
            email: "admin@gmail.com",
            fullName: "admin",
            roles: ["SUPERUSER"],
            password: bcrypt.hashSync("123", 10)
          })
          
        await user.save()
    }
}