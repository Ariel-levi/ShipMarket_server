const express = require("express");
const path = require("path");
const http = require("http");
const fileUpload = require("express-fileupload");
const { Server } = require("socket.io");
const cors = require("cors");
require("./db/mongoConnect");
require("dotenv").config();

const { routesInit, corsAccessControl } = require("./routes/config_routes");

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(
  fileUpload({
    limits: { filesSize: 1024 * 1024 * 5 }, //limit to 5 mb
  })
);
corsAccessControl(app);
routesInit(app);

const port = process.env.PORT;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL, //telling our server which server is going to be calling to our socket.io server, the client side
    methods: ["GET", "POST"], // methods allowed
  },
});

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("join", (orderId) => {
    socket.join(orderId);
    console.log(`Customer with ID ${socket.id} joined room ${orderId}`);
  });

  socket.on("taking_order", (orderId) => {
    socket.join(orderId);
    console.log(`Courier with ID ${socket.id} joined room ${orderId}`);
    socket
      .to(orderId)
      .emit("order_shipped", { msg: `Order number ${orderId} is on way` });
  });
});

console.log("Listen on Port : " + port);
server.listen(port);
