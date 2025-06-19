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
import {verifyJwt} from "../middlewares/auth.middlewares.js"

const router = Router();

router.use(verifyJwt); // Apply verifyJWT middleware to all routes in this file

router.route("/create").post(createPlaylist)

router
    .route("/user/:playlistId")
    .get(getPlaylistById)
    .patch(updatePlaylist)
    .delete(deletePlaylist);

router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist);
router.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist);

router.route("/user/:username/playlists").get(getUserPlaylists);
router.route("/search").get(getPlaylistsByTitle);

export default router