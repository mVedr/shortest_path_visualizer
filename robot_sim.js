import { io } from "socket.io-client";

const socket = io("ws://localhost:3003");

socket.on("start", (arg) => {
  const path = arg; 
  console.log(path)
  path.forEach((point, index) => {
    setTimeout(function () {
      console.log("reached : ", point);
      socket.emit("coordinates", point);
      if (index === path.length - 1) {
        socket.emit("endS", {});
      }
    }, index * 3500);
  });
});
