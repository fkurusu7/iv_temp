import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { create } from "../controllers/post.controller.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.json(200).json({ message: "fkjndfjkndfkjnfdkj" });
});
router.post("/create", verifyToken, create);

export default router;
