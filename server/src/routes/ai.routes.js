import { Router } from "express";
import { improveComment } from "../controllers/ai.controller.js";

const router = Router();

router.post('/improve-comment', improveComment);

export default router;