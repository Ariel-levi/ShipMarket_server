const express = require("express");
const { sendEmailPay, sendEmail } = require("../middlewares/sendEmail");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ msg: "email router works" })
})

router.post("/contact", (req, res) => {
  try {
    if (req.body.email.length < 3 || req.body.name.length < 2) {
      return res.status(400).jsom({ msg: "you must provide a valid name and email address" })
    }
    if (sendEmail(req.body)) {
      res.json({ msg: "email sent", status: "ok" })
    }
    else {
      return res.status(400).jsom({ msg: "you must provide a valid name and email address" })
    }
  } catch (error) {
    return res.status(500).jsom({ msg: "you must provide a valid name and email address" })
  }
})

module.exports = router;