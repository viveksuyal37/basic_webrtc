"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_http_1 = require("node:http");
const socket_io_1 = require("socket.io");
const UserManager_1 = require("./managers/UserManager");
const app = (0, express_1.default)();
const port = 3002;
const httpServer = (0, node_http_1.createServer)(app);
const userManager = new UserManager_1.UserManager();
const io = new socket_io_1.Server(httpServer, {
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
        console.log("user disconnected", socket.id);
        userManager.removeUser(socket);
    });
});
httpServer.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
