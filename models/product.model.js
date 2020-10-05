const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name:{type: String, require: true},
    description: {type:String},
    price: {type:Number, require: true},
    amount: {type:Number, require: true},
    createBy: { type: mongoose.Schema.Types.ObjectId, ref: "USER"},
})
 module.exports = mongoose.model("PROD", ProductSchema)