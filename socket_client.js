import { io } from "socket.io-client";

const socket = io("ws://localhost:3003");

socket.on("coordinates", (arg) => {
    console.log(arg);
});

socket.emit("coordinates",{x:1,y:0})