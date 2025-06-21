import { Router } from "express";
import { 
    loginUser, 
    registerUser, 
    logoutUser, 
    refreshAccessToken, 
    updateCurrentPassword,
    updateCurrentAvatar, 
    updateCurrentCoverImage,
    updateAllDetails,
    getCurrentUser,
    getUserChannelProfile,
    getWatchHistory,
    getUsersByUsername

}
from "../controllers/user.controller.js";
import { upload } from '../middlewares/multer.middlewares.js'
import { verifyJwt } from "../middlewares/auth.middlewares.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: 'avatar',
            maxCount: 1
        },
        {
            name: 'coverImage',
            maxCount: 1
        }
    ]),
    registerUser
);

router.route('/login').post(loginUser);

//protected routes
router.route('/logout').post( verifyJwt, logoutUser);
router.route('/refreshToken').post(refreshAccessToken);
router.route('/update-password').post(verifyJwt, upload.none(), updateCurrentPassword);
router.route('/update-avatar').post(verifyJwt, upload.single('avatar'), updateCurrentAvatar);
router.route('/update-coverImage').post(verifyJwt, upload.single('coverImage'), updateCurrentCoverImage);
router.route('/update-all-details').post(verifyJwt, upload.none(), updateAllDetails);
router.route('/me').get(verifyJwt, getCurrentUser);
router.route('/c/:username').get(verifyJwt, getUserChannelProfile);
router.route('/watchHistory').get(verifyJwt, getWatchHistory);
router.route('/search').get(getUsersByUsername);

export default router