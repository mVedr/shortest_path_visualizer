import { io } from "socket.io-client";

const socket = io("ws://localhost:3003");

socket.on("start", (arg) => {
  const path = arg; 
  console.log(path)
  for (let i = 0; i < path.length; i++) {
    setTimeout(function () {
        console.log("reached : ", path[i]);
        socket.emit("coordinates",path[i])
        if (i==path.length-1){
            socket.emit("end",{})
        }
    }, i * 3500);
  }
});
