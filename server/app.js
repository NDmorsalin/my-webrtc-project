const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",//or * for all other origins
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {

  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });


  socket.on("callUser", (data) => {

    io.to(data.userToCall).emit("callUser", {
      signal: data.signalData,
      from: data.from,
      name: data.name,
    });

  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
  
});

const port = process.env.PORT || 5500;
server.listen(port, () => {
  console.log(`server listening on ${port}`);
});
