import { Router } from "express";
import { 
    postTweet,
    deleteTweet,
    editTweet
} from "../controllers/tweet.controller.js";
import {verifyJwt} from '../middlewares/auth.middlewares.js'

const router = Router()

router.route('/create/postTweet').post(verifyJwt, postTweet);
router.route('/delete/:deleteTweet').delete(verifyJwt, deleteTweet);
router.route('/update/:editTweet').patch(verifyJwt, editTweet);

export default router