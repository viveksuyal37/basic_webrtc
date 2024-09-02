import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { UserManager } from "./managers/UserManager";

const app = express();
const port = 3002;

const httpServer = createServer(app);

const userManager = new UserManager();

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

app.get("/", (req, res) => {
  res.send("Socket.io server is running");
});

io.on("connection", (socket) => {
  console.log("user connected:", socket.id);

  userManager.addUser("UserName", socket);

  socket.on("disconnect", () => {
    console.log("user disconnected",socket.id);
    userManager.removeUser(socket);
  });

});

httpServer.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
