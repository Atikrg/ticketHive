
import { io } from "socket.io-client";

const ENV_MODE = import.meta.env.VITE_ENV_MODE || "development";
const socket_url = import.meta.env.VITE_API_URL || "development";


if (!socket_url) {
console.error(`⚠️ Socket URL is undefined for ENV_MODE: ${ENV_MODE}`);
}

const socket = io(socket_url, {
transports: ["websocket"],
reconnectionAttempts: 5,
timeout: 20000,
secure: true,
});

export default socket;
