import "dotenv/config";
import server from "./socket/socket";
import connectMongoDB from "./config/databaseConfig";

const port = process.env.PORT || 3000;

connectMongoDB();
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
