import {Router} from "express";
import {addView, getVideoViews} from "../controllers/view.controller.js";
import {verifyJwt, optionalAuth} from "../middlewares/auth.middlewares.js";

const router = Router();

router.post("/add/:videoId", verifyJwt, addView);
router.get("/:videoId", optionalAuth, getVideoViews);

export default router;