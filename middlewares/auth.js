const { default: axios } = require("axios");
const jwt = require("jsonwebtoken");
const { secret } = require("../config/config");
const { StoreModel } = require("../models/storeModel");

//auth user
exports.auth = (req, res, next) => {
  let token = req.header("x-api-key");
  if (!token) {
    return res.status(401).json({ err: "You must send a token" });
  }
  try {
    let decodeToken = jwt.verify(token, secret.jwtSecret);
    req.tokenData = decodeToken;
    next();
  } catch (err) {
    return res.status(401).json({ err: "Token invalid or expired" });
  }
};

// payPal Auth
exports.payPalAuth = async (_tokenId, _orderId, _ifRealPay = true) => {
  let url = !_ifRealPay
    ? "https://api-m.sandbox.paypal.com/v2/checkout/orders/" + _orderId
    : "https://api-m.paypal.com/v2/checkout/orders/" + _orderId;
  try {
    let resp = await axios({
      method: "GET",
      url: url,
      headers: {
        Authorization: "Bearer " + _tokenId,
        "content-type": "application/json",
      },
    });
    console.log(resp.data);
    console.log(resp.data);
    return resp.data;
  } catch (err) {
    console.log(err.response);
    return err.response;
  }
};

//auth system admin
exports.authSystemAdmin = (req, res, next) => {
  let token = req.header("x-api-key");
  if (!token) {
    return res
      .status(401)
      .json({ err: "You must send token in header to this endpoint" });
  }
  try {
    let decodeToken = jwt.verify(token, secret.jwtSecret);
    // check if user role is system admin
    if (decodeToken.role == "system_admin") {
      req.tokenData = decodeToken;
      next();
    } else {
      return res
        .status(401)
        .json({ err: "You must be admin in this endpoint" });
    }
  } catch (err) {
    return res
      .status(401)
      .json({ err: "Token invalid (if you hacker) or expired" });
  }
};

//auth store admin
exports.authStoreAdmin = async (req, res, next) => {
  let token = req.header("x-api-key");
  let idStore = req.params.idStore;
  if (!token) {
    return res
      .status(401)
      .json({ err: "You must send token in header to this endpoint" });
  }
  try {
    let decodeToken = jwt.verify(token, secret.jwtSecret);
    req.tokenData = decodeToken;
    //verify the user id the store's admin or system admin
    let store = await StoreModel.findOne({
      _id: idStore,
      adminId: decodeToken._id,
    });
    if (store || req.tokenData.role == "system_admin") {
      next();
    } else {
      return res.status(401).json({ err: "you are not the admin" });
    }
  } catch (err) {
    return res
      .status(401)
      .json({ err: "Token invalid (if you hacker) or expired" });
  }
};
