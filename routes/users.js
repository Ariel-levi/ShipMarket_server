const express = require("express");
const {
  validateUser,
  UserModel,
  validateLogin,
  genToken,
} = require("../models/userModel");
const router = express.Router();
const bcrypt = require("bcrypt");
const { auth, authAdmin } = require("../middlewares/auth");
const { pick } = require("lodash");

router.get("/", (req, res) => {
  res.json({ msg: "Users work" });
});

// all users
router.get("/usersList", async (req, res) => {
  let perPage = req.query.perPage || 10;
  let page = req.query.page >= 1 ? req.query.page - 1 : 0;
  try {
    let data = await UserModel.find({}, { password: 0 })
      .limit(perPage)
      .skip(page * perPage);
    res.json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// get amount of users
router.get("/amount", async (req, res) => {
  try {
    let cat = req.query.cat || null;
    objFind = cat ? { cat_short_id: cat } : {};
    // countDocuments -> return just the amount of documents in the collections
    let data = await UserModel.countDocuments(objFind);
    res.json({ amount: data });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//check the user's token validate and return info about the user role
router.get("/checkUserToken", auth, async (req, res) => {
  res.json({
    status: "ok",
    msg: "token has been verified",
    tokenData: req.tokenData,
  });
});

// user info
router.get("/myInfo", auth, async (req, res) => {
  try {
    let data = await UserModel.findOne(
      { _id: req.tokenData._id },
      { password: 0 }
    );
    res.json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// add new user
router.post("/", async (req, res) => {
  // check validate req.body
  let validBody = validateUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let user = new UserModel(req.body);
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    // user.password = "*****";
    let userObj = pick(user, ["_id", "name", "email", "address", "role"]);

    return res.status(201).json(userObj);
  } catch (err) {
    if (err.code == 11000) {
      return res.status(400).json({ err: "User already in system" });
    }
    console.log(err);
    return res.status(500).json(err);
  }
});

// login
router.post("/login", async (req, res) => {
  let validBody = validateLogin(req.body);
  if (validateLogin.error) {
    res.status(400).json(validBody.error.details);
  }
  try {
    let user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ err: "User not found" });
    }
    let validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
      return res.status(401).json({ err: "user or password is wrong" });
    }

    res.json({ token: genToken(user._id, user.role, user.name) });
  } catch (err) {
    console.log(err);
  }
});

// can change the role of user to admin or user , must be admin in this endpoint
router.patch("/changeRole/:userId/:role", authAdmin, async (req, res) => {
  let userId = req.params.userId;
  let role = req.params.role;
  try {
    // prevent from user to chanch himself or the first admin
    if (userId != req.tokenData._id && userId != "61ee907a96a80382f70b873e") {
      let data = await UserModel.updateOne({ _id: userId }, { role: role });
      res.json(data);
    } else {
      res.status(401).json({ err: "You cant change your self" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// del user - DELETE
router.delete("/delete/:delId", authAdmin, async (req, res) => {
  let delId = req.params.delId;
  try {
    if (delId != req.tokenData._id && delId != "624ec1afab89e9f16e36cb6c") {
      let data = await UserModel.deleteOne({
        _id: delId,
      });
      // deletedCount -> 1 del success msg
      res.json(data);
    } else {
      res
        .status(401)
        .json({ err: "You cant delete your self Or the superAdmin" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
