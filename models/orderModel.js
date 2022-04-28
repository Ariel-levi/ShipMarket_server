const mongoose = require('mongoose')
const Joi = require('joi')

const orderSchema = new mongoose.Schema({
    products_ar:{
        type:Array, default:[]
    },
    user_id:String, 
    status:{
        type:String, default:"pending"
    },
    total_price:Number,
    data_created:{
        type:Date, default:Date.now()
    }, 
    driver_id:String

})

exports.OrderModel = mongoose.model("orders", orderSchema)

exports.validateOrder = (_bodyReq) => { 
    let joiSchema = Joi.object({
        // products_ar: Joi.array().min(1).max(999).required(),
        total_price: Joi.number().min(1).max(9999).required()
    })
    return joiSchema.validate(_bodyReq)
}