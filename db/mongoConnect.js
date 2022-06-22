const mongoose = require("mongoose");
const { secret } = require("../config/config");
require("dotenv").config();

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.DB);
  console.log("Mongo Connected... (Deliver Project)");
}
