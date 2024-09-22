import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_SERVICE_URL);

socket.on("connect", () => {
    console.log("Connected Socket: ", socket.id);
});

socket.on("disconnect", () => {
    console.log("Disconnected Socket: ", socket.id);
});

export default socket;