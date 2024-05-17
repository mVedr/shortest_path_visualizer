import { createClient } from 'redis';
import { io } from "socket.io-client";

// Initialize Redis client
const client = createClient();
client.on('error', (err) => console.log('Redis Client Error', err));

await client.connect();

// Initialize Socket.io client
const socket = io("ws://localhost:3003");

socket.on("start", async (path) => {
  console.log("Received path:", path);

  for (let index = 0; index < path.length; index++) {
    const point = path[index];

    // Simulate robot reaching the point
    setTimeout(async function () {
      console.log("reached: ", point);
      socket.emit("coordinates", point);

      if (index === path.length - 1) {
        console.log("THE END....", point.fwd);

        socket.emit("endS", point.fwd);
        try {
          await client.set("currForward", point.fwd);
          console.log("Redis set");
        } catch (error) {
          console.error("Redis set error:", error);
        }
      }
    }, index * 3500);
  }
});
