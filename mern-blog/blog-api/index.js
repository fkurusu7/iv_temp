import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./src/routes/user.route.js";
import authRouter from "./src/routes/auth.route.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_DB)
  .then(console.log("Database connected"))
  .catch((error) => console.log(error));

const app = express();
// for parsing application/json
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

app.listen(5174, () => {
  console.log("Server running on port 5174!!");
});
