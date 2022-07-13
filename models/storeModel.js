const mongoose = require("mongoose");
const Joi = require("joi");
const { array } = require("joi");

let storeSchema = new mongoose.Schema({
  name: String,
  info: String,
  img_url: String,
  address: Object,
  admin_id: String,
  status: {
    type: String,
    default: "pending",
  },
  date_created: {
    type: Date,
    default: Date.now(),
  },
  short_id: String,
  categories: {
    type: Array,
    default: [],
  },
});
exports.StoreModel = mongoose.model("stores", storeSchema);

exports.validateStore = (_bodyReq) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(2).max(150).required(),
    address: Joi.object().required(),
    info: Joi.string().min(3).max(500).required(),
    img_url: Joi.string().min(3).max(500).allow(null, ""),
  });
  return joiSchema.validate(_bodyReq);
};
