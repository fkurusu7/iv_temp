import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import { getAllTags, getTopTags } from "../controllers/tags.controller.js";

const router = express.Router();

router.get("/", verifyToken, getAllTags);
router.get("/top", verifyToken, getTopTags);

export default router;
