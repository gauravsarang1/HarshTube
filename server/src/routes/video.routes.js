import { uploadVideo, getAllUploadedVideos, allVideos, getVideoById,deleteVideo, getVideosByTitle, getAllUserUploadedVideos } from '../controllers/video.controller.js'
import { verifyJwt } from '../middlewares/auth.middlewares.js'
import { Router } from 'express'
import { upload } from '../middlewares/multer.middlewares.js'

const router = Router()

router.route('/upload-Video').post(verifyJwt, upload.fields([
    {
        name: "filePath",
        maxCount: 1
    },
    {
        name: 'thumbnail',
        maxCount: 1
    }
]), uploadVideo);

router.route('/search').get(getVideosByTitle);
router.route('/all-uploaded-videos').get(verifyJwt, getAllUserUploadedVideos);
router.route('/all-uploaded-videos/:username').get(getAllUploadedVideos)
router.route('/all-videos').get(allVideos);
router.route('/:videoId').get(getVideoById);
router.route('/delete/:videoId').delete(verifyJwt, deleteVideo);


export default router