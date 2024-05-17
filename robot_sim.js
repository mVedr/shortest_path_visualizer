import { io } from "socket.io-client";

const socket = io("ws://localhost:3003");

socket.on("start", (arg) => {
  const path = arg; 
  console.log(path)

  //Simulation
  path.forEach((point, index) => {
    setTimeout(function () {
      console.log("reached : ", point);
      socket.emit("coordinates", point);
      if (index === path.length - 1) {
        console.log(point)
        socket.emit("endS", point);
      }
    }, index * 3500);

    //Real Script
    /*
      for v in path:
        if robotGoFromP1ToP2(v[i],v[i+1]).then(
          socket.emit("reached",*)
        )
    */
  });
});
