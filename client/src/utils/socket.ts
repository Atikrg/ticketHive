
import { io } from "socket.io-client";

const ENV_MODE = import.meta.env.VITE_ENV_MODE || "development";
const socket_url = import.meta.env.VITE_BACKEND_API_URL || "development";


if (!socket_url) {
    console.error(`⚠️ Socket URL is undefined for ENV_MODE: ${ENV_MODE}`);
}



const socket = io("/", {
    path: "/socket.io",
});



export default socket;
