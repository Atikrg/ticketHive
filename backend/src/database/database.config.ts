import mongoose from "mongoose";
import { createIndexes } from "./indexes";
import { startSeatExpiryWorker } from "../controllers/seatExpiry.controller";
(async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("❌ MONGO_URI environment variable is not set");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
    await createIndexes();
    startSeatExpiryWorker(); 

  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ MongoDB connection failed:", error.message);
    } else {
      console.error("❌ MongoDB connection failed:", error);
    }
    process.exit(1);
  }
})();

