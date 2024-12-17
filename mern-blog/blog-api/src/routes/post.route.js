import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  create,
  getPosts,
  remove,
  update,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/getPosts", getPosts);
router.post("/create", verifyToken, create);
router.delete("/delete/:postId/:userId", verifyToken, remove);
router.put("/update/:postId/:userId", verifyToken, update);

export default router;
