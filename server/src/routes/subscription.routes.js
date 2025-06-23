import { Router } from "express";
import { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels } from "../controllers/subscription.controller.js";
import { verifyJwt, optionalAuth } from '../middlewares/auth.middlewares.js'


const router = Router();

router.route('/toggle/sub/:channelId').post(verifyJwt, toggleSubscription);
router.route('/get/user/subscribers/:channelId').get(optionalAuth, getUserChannelSubscribers);
router.route('/get/user/subscribedTo/:subscriberId').get(verifyJwt, getSubscribedChannels)

export default router