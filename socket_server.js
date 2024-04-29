import { Server } from "socket.io";

const io = new Server(3003,
    {
        cors:{
            origin: "http://localhost:5173/"
        }
    }
);

io.on("connection", (socket) => {
    socket.on("coordinates", (arg) => {
        console.log(arg);
        io.emit("coordinates", arg);
    });
    socket.on("start",(arg)=>{
        io.emit("start" ,arg)
    });
    socket.on("endS",(arg)=>{
        io.emit("end",arg)
    });
});