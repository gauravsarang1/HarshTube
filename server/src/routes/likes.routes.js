import { Router } from 'express';
import {
    getAllVideoLikes,
    toggleCommentLike,
    toggleVideoReaction,
    toggleTweetLike,
    getAllVideoDislikes,
    getAllCommentLikes,
    getAllLikedVideos,
    deleteAllVideosLiked
} from "../controllers/likes.controller.js"
import {verifyJwt} from "../middlewares/auth.middlewares.js"

const router = Router();
router.use(verifyJwt); // Apply verifyJWT middleware to all routes in this file

router.route("/toggle/v/:videoId").post(toggleVideoReaction);
router.route("/toggle/c/:commentId").post(toggleCommentLike);
router.route("/toggle/t/:tweetId").post(toggleTweetLike);
router.route("/get/video/likes/:videoId").get(getAllVideoLikes);
router.route("/get/video/dislikes/:videoId").get(getAllVideoDislikes);
router.route("/get/comment/likes/:commentId").get(getAllCommentLikes);
router.route("/get/user/liked-videos").get(getAllLikedVideos);
router.route("/delete/all/liked-videos").delete(deleteAllVideosLiked);

export default router