const mongoose = require('mongoose')
const rolesConst =  require('../constants/roles.const')

const UserSchema = new mongoose.Schema({
    email: { type:String, require: true, unique:true},
    fullName: {type:String, require: true},
    roles: [{type: String, enum: rolesConst.ROLES, require:true}],
    token: [{type: String}],
    password: {type: String, require: true},
})

module.exports = mongoose.model("USER", UserSchema)
