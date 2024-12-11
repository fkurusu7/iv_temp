import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose
  .connect(process.env.MONGO_DB)
  .then(console.log("Database connected"))
  .catch((error) => console.log(error));

const app = express();

app.listen(5174, () => {
  console.log("Server running on port 5174!!");
});
