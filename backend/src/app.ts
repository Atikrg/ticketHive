import express from "express";
import dotenv from "dotenv";
import { Request, Response } from "express";
dotenv.config();

const app = express();


app.get("/", (req: Request, res: Response) => {
  res.send("Server is running");
})

export default app;

