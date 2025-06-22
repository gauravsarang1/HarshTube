import { Router } from 'express';
import {
    addVideoToPlaylist,
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    removeVideoFromPlaylist,
    updatePlaylist,
    getPlaylistsByTitle
} from "../controllers/playlist.controller.js"
import {verifyJwt, optionalAuth} from "../middlewares/auth.middlewares.js"

const router = Router();

// Public routes (no authentication required)
router.route("/user/:username/playlists").get(getUserPlaylists);
router.route("/search").get(getPlaylistsByTitle);

// Protected routes (authentication required)
router.route("/create").post(verifyJwt, createPlaylist)

router.route("/add/:videoId/:playlistId").patch(verifyJwt, addVideoToPlaylist);
router.route("/remove/:videoId/:playlistId").patch(verifyJwt, removeVideoFromPlaylist);

router
    .route("/:playlistId")
    .get(optionalAuth, getPlaylistById)
    .patch(verifyJwt, updatePlaylist)
    .delete(verifyJwt, deletePlaylist);

export default router