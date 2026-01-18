import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import "./database/database.config";
import server from "./socket/socket";



if (!process.env.PORT) {
  throw new Error("PORT environment variable is not set");
}


const PORT = Number(process.env.PORT);
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});