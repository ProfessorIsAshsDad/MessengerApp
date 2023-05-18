const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io")
app.use(cors());

const server = http.createServer(app);


//setup new socket io server, specify Cors methods used
const io = new Server(server, {
    cors: {
        origin: " https://sweet-pony-7f337f.netlify.app",
        methods: ["GET", "POST"]
    },
});

//initiate connection event to the server, initiate callback function, specify socket and event listeners.
io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
  
    //data from front-end over to server to detect the joining of a room
    socket.on("join_room", (data) => {
      socket.join(data);
      console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    //data from front-end over to server to detect the sending and receiving of messages.
    socket.on("send_message", (data) => {
        console.log(data)
        socket.to(data.room).emit("receive_message" ,data)
    });

    //listening event for disconnection from the server
    socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id);
    });
  });

server.listen(3001, () => {
    console.log("server listening on port 3001")
});