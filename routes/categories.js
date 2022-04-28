const express = require("express");
const { random } = require("lodash");
const { authStoreAdmin } = require("../middlewares/auth");
const { genShortId } = require("../misc/genShortId");
const {
  validateCategory,
  CategoryModel,
} = require("../models/categoriesModell");
const { StoreModel } = require("../models/storeModel");
const { genToken } = require("../models/userModel");
const router = express.Router();

// get all category
router.get("/", async (req, res) => {
  let perPage = req.query.perPage || 5;
  let page = req.query.page >= 1 ? req.query.page - 1 : 0;
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? 1 : -1;
  try {
    let data = await CategoryModel.find({})
      .limit(perPage)
      .skip(page * perPage)
      .sort({ [sort]: reverse });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// get all the categories that belong to the store
router.get("/storeCat/:id", async (req, res) => {
  let id = req.params.id;
  try {
    // get store info
    let dataStore = await StoreModel.findOne({ _id: id });
    // get all the categories
    let data = await CategoryModel.find({ store_short_id: dataStore.short_id });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/amount", async (req, res) => {
  try {
    let cat = req.query.cat || null;
    objFind = cat ? { cat_short_id: cat } : {};
    // countDocuments -> return just the amount of documents in the collections
    let data = await CategoryModel.countDocuments(objFind);
    res.json({ amount: data });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// get category by url_name
router.get("/single/:url_name", async (req, res) => {
  try {
    let data = await CategoryModel.findOne({ url_name: req.params.url_name });
    res.json(data);
  } catch (error) {
    console.log(err);
    res.status(500).json(err);
  }
});

// for the superAdmin edit
// get single category by id
router.get("/singleId/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let data = await CategoryModel.findOne({ _id: id });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// add new category
router.post("/", authStoreAdmin, async (req, res) => {
  let validBody = validateCategory(req.body);
  if (validBody.error) {
    return res.status(400).json({ msg: "" });
  }
  try {
    let category = new CategoryModel(req.body);
    category.short_id = await genShortId(CategoryModel);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    return res.status(500).json(err);
  }
});

// Edit category
router.put("/:url_name", authStoreAdmin, async (req, res) => {
  let validBody = validateCategory(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let url_name = req.params.url_name;
    let data = await CategoryModel.updateOne({ url_name: url_name }, req.body);
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Del category
router.delete("/:idDelete", authStoreAdmin, async (req, res) => {
  try {
    let idDelete = req.params.idDelete;
    // need to delete the all products , finde - delete products short_id
    let data = await CategoryModel.deleteOne({ _id: idDelete });
    res.json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

module.exports = router;
