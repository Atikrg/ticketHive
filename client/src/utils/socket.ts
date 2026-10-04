
import { io } from "socket.io-client";

const ENV_MODE = import.meta.env.VITE_ENV_MODE || import.meta.env.MODE || "development";

const DEFAULT_SOCKET_URL = import.meta.env.PROD
    ? window.location.origin
    : "http://localhost:5000";

const socket_url = import.meta.env.VITE_SOCKET_URL || DEFAULT_SOCKET_URL;


if (!socket_url) {
    console.error(`⚠️ Socket URL is undefined for ENV_MODE: ${ENV_MODE}`);
}

console.log("SOCKET URL", socket_url, "ENV_MODE", ENV_MODE);

const socket = io(socket_url, {
    path: "/socket.io",
    transports: ["polling"],
    timeout: 5000
});



export default socket;
