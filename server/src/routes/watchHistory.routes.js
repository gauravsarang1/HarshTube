import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import {
    getWatchHistory,
    addToWatchHistory,
    deleteAllWatchHistory,
    deleteSingleWatchHistory
} from "../controllers/watchHistory.controller.js";

const router = Router();
router.use(verifyJwt); // Apply verifyJwt middleware to all routes in this file

router.route("/add/:videoId").post(addToWatchHistory);
router.route("/get").get(getWatchHistory);
router.route("/delete/:videoId").delete(deleteSingleWatchHistory);
router.route("/delete/all/watch-history").delete(deleteAllWatchHistory);

export default router;
// Export the router to be used in the main app