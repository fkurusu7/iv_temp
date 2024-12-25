import express from "express";
import {
  getImageUploadUrl,
  fetchImageByUrl,
} from "../controllers/posts.controller.js";
const router = express.Router();

router.get("/getImageUploadUrl", getImageUploadUrl);
router.get("/fetchImageByUrl", fetchImageByUrl);

export default router;
