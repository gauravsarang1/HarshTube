import { Router } from "express";
import { 
    addComment,
    updateComment,
    deleteComment,
    getAllComments
    } 
from "../controllers/comment.controller.js";
import { verifyJwt, optionalAuth } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route('/add/:videoId').post(verifyJwt, addComment);
router.route('/update/:commentId').patch(verifyJwt, updateComment);
router.route('/delete/:commentId').delete(verifyJwt, deleteComment);
router.route('/all/:videoId').get(optionalAuth, getAllComments);

export default router