import { Server } from "socket.io";
import { createServer } from 'http';
import express from "express";

const app = express()
const server = createServer(app)
const io = new Server(server)

io.on('connection', (socket) => {
    console.log(socket);
})

server.listen(5000, () => {
    console.log('connected');
})