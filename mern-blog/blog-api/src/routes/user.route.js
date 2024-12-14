import express from "express";
import {
  updateUser,
  deleteUser,
  signoutUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.put("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.post("/signout", signoutUser);

export default router;
