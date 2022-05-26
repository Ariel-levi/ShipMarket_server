const express = require("express");
const {
  auth,
  authStoreAdmin,
  authSystemAdmin,
} = require("../middlewares/auth");
const { genShortId } = require("../misc/genShortId");
const { StoreModel, validateStore } = require("../models/storeModel");
const { UserModel } = require("../models/userModel");
const router = express.Router();

//get all stores
router.get("/", async (req, res) => {
  let perPage = req.query.perPage || 5;
  let page = req.query.page >= 1 ? req.query.page - 1 : 0;
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? 1 : -1;
  let status = req.query.status;
  try {
    let filter = status ? { status } : {};
    let data = await StoreModel.find(filter)
      .limit(perPage)
      .skip(page * perPage)
      .sort({ [sort]: reverse });
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// get user stores
router.get("/userStores", authStoreAdmin, async (req, res) => {
  try {
    let user_id = req.tokenData._id;
    let data = await StoreModel.find({ admin_id: user_id }).sort({
      date_created: -1,
    });
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

    // filter To get just the active stores
    let filterData = data.filter((store) => store.status === "active");
    res.json(filterData);
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
  let status = req.query.status;
  let cat = req.query.cat || null;
  try {
    let filter = status ? { status } : {};
    // objFind = cat ? { cat_short_id: cat } : {};
    // countDocuments -> return just the amount of documents in the collections
    let data = await StoreModel.countDocuments(filter);
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
    if (err.code == 11000) {
      return res
        .status(400)
        .json({ ...err, message: "store name already taken" });
    }
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

// change store status
router.patch("/updateStatus/:idStore", authSystemAdmin, async (req, res) => {
  try {
    let idStore = req.params.idStore;
    let store = await StoreModel.findOne({ _id: idStore });
    let status = store.status === "pending" ? "active" : "pending";
    let data = await StoreModel.updateOne({ _id: idStore }, { status });
    data.status = status;
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

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
