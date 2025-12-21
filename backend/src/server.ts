import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import "./config/database.config";
import server from "./socket/socket";

const PORT = Number(process.env.PORT) || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});