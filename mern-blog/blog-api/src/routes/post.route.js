import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { create, getPosts } from "../controllers/post.controller.js";

const router = express.Router();

router.get("/getPosts", getPosts);
router.post("/create", verifyToken, create);

export default router;
