import express from "express";
import { getImageUploadUrl } from "../controllers/posts.controller.js";
const router = express.Router();

router.get("/getImageUploadUrl", getImageUploadUrl);

export default router;
