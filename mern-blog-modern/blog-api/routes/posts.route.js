import express from "express";
const router = express.Router();

import {
  getImageUploadUrl,
  fetchImageByUrl,
  createPost,
  getPosts,
} from "../controllers/posts.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

router.get("/getImageUploadUrl", getImageUploadUrl);
router.get("/fetchImageByUrl", fetchImageByUrl);
router.post("/create", verifyToken, createPost);
router.get("/getPosts", getPosts);

export default router;
