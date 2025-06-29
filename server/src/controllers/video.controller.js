import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { Video } from "../models/video.model.js";
import mongoose from "mongoose";
import { deleteFromCloudinary } from "../utils/deleteFromCloudinary.js";
import { User } from "../models/user.model.js";

const uploadVideo = asyncHandler(async(req, res) => {
    const { title, description } = req.body

    if(!(title || description)) {
        throw new ApiError(401, 'Time or Description must required')
    }

    const videoLocalPath = req.files?.filePath[0]?.path
    if(!videoLocalPath) {
        throw new ApiError(401, 'video local path is empty')
    }

    let thumbnailLocalPath;
    
    if(req.files.thumbnail || Array.isArray(req.files.thumbnail) || req.files.thumbnail?.length > 0) {
        thumbnailLocalPath = req.files.thumbnail[0].path
    }

    if(!videoLocalPath) {
        throw new ApiError(401, 'Video file must required')
    }

    const videoCloudPath = await uploadOnCloudinary(videoLocalPath);
    if (!videoCloudPath || !videoCloudPath.response) {
        throw new ApiError(401, 'Uploading video on cloudinary failed');
    }
    const { response: video, duration } = videoCloudPath;

    let thumbnail = '';
    if (thumbnailLocalPath) {
        const thumbnailCloudPath = await uploadOnCloudinary(thumbnailLocalPath);
        thumbnail = thumbnailCloudPath?.response?.url || '';
    }

    const uploadedVideo = await Video.create({
        filePath: video.url,
        title,
        description,
        thumbnail,
        duration,
        owner: req.user._id
    });


    if(!uploadVideo) {
        throw new ApiError(401, 'Something went wrong while uploading video documents')
    }

    return res.status(200)
    .json(
        new ApiResponse(200, uploadedVideo, 'Video Uploaded SuccessFully')
    )

})

// ...existing code...

const getAllUploadedVideos = asyncHandler(async(req, res) => {

    const user = req.params.username;
    if(!user) {
        throw new ApiError(400, 'User ID is required');
    }

    const userId = await User.findOne({
        username: user
    })
    if(!userId) {
        throw new ApiError(404, 'User not found');
    }

    const page = parseInt(req.query.page) || 1; // Current page number
    const limit = parseInt(req.query.limit) || 10; // Videos per page
    const skip = (page - 1) * limit;

    const [videos, total] = await Promise.all([
        Video.find({ owner: userId._id })
            .skip(skip)
            .limit(limit)
            .populate('owner', 'username avatar fullName'),
        Video.countDocuments({ owner: userId._id })
    ]);

    return res.status(200)
    .json(
        new ApiResponse(200, {
            videos,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            totalVideos: total,
            hasMore: skip + videos.length < total
        }, 'All uploaded Videos Fetched Successfully')
    )
})

const allVideos = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Use aggregation pipeline for more robust data fetching
    const videoAggregation = Video.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'ownerDetails'
            }
        },
        {
            $unwind: '$ownerDetails' // Unwind to get owner details as an object
        },
        {
            $sort: { createdAt: -1 } // Sort by creation date
        },
        {
            $skip: skip
        },
        {
            $limit: limit
        },
        {
            $project: {
                _id: 1,
                filePath: 1,
                thumbnail: 1,
                title: 1,
                description: 1,
                duration: 1,
                views: 1,
                createdAt: 1,
                owner: {
                    _id: '$ownerDetails._id',
                    username: '$ownerDetails.username',
                    avatar: '$ownerDetails.avatar',
                    fullName: '$ownerDetails.fullName'
                }
            }
        }
    ]);

    const [videos, total] = await Promise.all([
        videoAggregation.exec(),
        Video.countDocuments({})
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                videos,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                totalVideos: total,
                hasMore: skip + videos.length < total
            },
            'All Videos Fetched Successfully'
        )
    );
});

// ...existing code...

const getVideoById = asyncHandler(async(req, res) => {
    const videoId = req.params.videoId;
    if(!videoId) {
        throw new ApiError(400, 'Video ID is required');
    }

    // Fix: Use mongoose.Types.ObjectId.isValid instead of mongoose.Schema.ObjectId.isValid
    if(!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, 'Invalid video ID');
    }

    const video = await Video.findById(videoId).populate('owner', 'username avatar fullName');
    if(!video) {
        throw new ApiError(404, 'Video not found');
    }

    return res.status(200)
    .json(
        new ApiResponse(200, video, 'Video fetched successfully')
    );
})

const deleteVideo = asyncHandler(async(req, res) => {
    const videoId = req.params.videoId;
    if(!videoId) {
        throw new ApiError(400, 'Video ID is required');
    }

    const video = await Video.findById(videoId);
    if(!video) {
        throw new ApiError(404, 'Video not found');
    }

    if(video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, 'You are not authorized to delete this video');
    }

    try {
        if( video.filePath && video.filePath !== '') {
            const cloudinaryUrl = video.filePath;
            // Extract correct public_id
            const relativePath = cloudinaryUrl.split('/upload/')[1]; // v1234/folder/filename.jpg
            const segments = relativePath.split('/');
            segments.shift(); // Remove version like "v12345678"
            const publicId = segments.join('/').split('.')[0];
    
            console.log('✅ Correct publicId:', publicId);
    
            await deleteFromCloudinary(publicId, 'video');
        }
        if(video.thumbnail && video.thumbnail !== '') {
            const cloudinaryUrl = video.thumbnail;
            const relativePath = cloudinaryUrl.split('/upload/')[1];
            const segments = relativePath.split('/');
            segments.shift();
            const publicId = segments.join('/').split('.')[0];

            await deleteFromCloudinary(publicId, 'image');
        }
    } catch (error) {
        throw new ApiError(500, 'Failed to delete video or thumbnail from Cloudinary');
    } finally {
        await video.deleteOne();
    }


    return res.status(200)
    .json(
        new ApiResponse(200, null, 'Video deleted successfully')
    );
})

const getVideosByTitle = asyncHandler(async(req, res) => {
    const title = req.query.q;    
    if(!title) {
        throw new ApiError(400, 'Title is required');
    }

    const videos = await Video.find({ title: { $regex: title, $options: 'i' } }).populate('owner', 'username avatar fullName');
    if(!videos || videos.length === 0) {
        return res.status(200).json(new ApiResponse(200, [], 'No videos found'));
    }

    return res.status(200)
    .json(
        new ApiResponse(200, videos, 'Videos fetched successfully')
    );
})

const getAllUserUploadedVideos = asyncHandler(async(req, res) => {

    const user = req.user
    if(!user) {
        throw new ApiError(400, 'User ID is required');
    }


    const page = parseInt(req.query.page) || 1; // Current page number
    const limit = parseInt(req.query.limit) || 10; // Videos per page
    const skip = (page - 1) * limit;

    const [videos, total] = await Promise.all([
        Video.find({ owner: user._id })
            .skip(skip)
            .limit(limit)
            .populate('owner', 'username avatar fullName'),
        Video.countDocuments({ owner: user._id })
    ]);

    return res.status(200)
    .json(
        new ApiResponse(200, {
            videos,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            totalVideos: total,
            hasMore: skip + videos.length < total
        }, 'All uploaded Videos Fetched Successfully')
    )
})

export {
    uploadVideo,
    getAllUploadedVideos,
    allVideos,
    getVideoById,
    deleteVideo,
    getVideosByTitle,
    getAllUserUploadedVideos
}