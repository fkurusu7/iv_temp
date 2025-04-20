import express from "express";

import { register } from "../controllers/authentication";

const router = express.Router();
router.post("/api/auth/register", register as express.RequestHandler);

export default router;
