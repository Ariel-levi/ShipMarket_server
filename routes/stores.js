const express = require("express");
const { auth, authStoreAdmin, authSystemAdmin } = require("../middlewares/auth");
const { genShortId } = require("../misc/genShortId");
const { StoreModel, validateStore } = require("../models/storeModel");
const router = express.Router();

//get all stores
router.get("/", async (req, res) => {
  let perPage = req.query.perPage || 5;
  let page = req.query.page >= 1 ? req.query.page - 1 : 0;
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? 1 : -1;
  try {
    let data = await StoreModel.find({})
      .limit(perPage)
      .skip(page * perPage)
      .sort({ [sort]: reverse });
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//?s=
router.get("/search", async (req, res) => {
  let perPage = req.query.perPage || 5;
  let page = req.query.page >= 1 ? req.query.page - 1 : 0;
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? -1 : 1;
  let searchQ = req.query.s;
  try {
    // i -> cancel the case sensitve
    let searchReg = new RegExp(searchQ, "i");
    let data = await StoreModel.find({
      $or: [{ name: searchReg }, { info: searchReg }],
    })
      .limit(perPage)
      .skip(page * perPage)
      .sort({ [sort]: reverse });
    // if(data=""){
    //   data = "not found"
    // }
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//get single stores
router.get("/single/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let data = await StoreModel.findOne({ _id: id });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// get amount of stores
router.get("/amount", async (req, res) => {
  try {
    let cat = req.query.cat || null;
    objFind = cat ? { cat_short_id: cat } : {};
    // countDocuments -> return just the amount of documents in the collections
    let data = await StoreModel.countDocuments(objFind);
    res.json({ amount: data });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//open new Store
router.post("/", auth, async (req, res) => {
  let validBody = validateStore(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let store = new StoreModel(req.body);
    // short_id , admin_id ,
    store.admin_id = req.tokenData._id;
    store.short_id = await genShortId(StoreModel);
    await store.save();
    res.status(201).json(store);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});


//Edit  Store
router.put("/:id", authStoreAdmin, async (req, res) => {
  try {
    // let idEdit = req.params.idEdit;
    let idEdit = req.params.id;
    let data = await StoreModel.updateOne({ _id: idEdit }, req.body);
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});
// aprove store request 
router.patch("/approval/:idStore", authSystemAdmin, async (req, res) => {
  try {
    let idStore = req.params.idStore
    let data = await StoreModel.updateOne({ _id: idStore }, {status:"approved"})
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
})

//Delete  Store
router.delete("/:id", authStoreAdmin, async (req, res) => {
  try {
    let idDel = req.params.id;
    let data = await StoreModel.deleteOne({ _id: idDel });
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});
module.exports = router;
