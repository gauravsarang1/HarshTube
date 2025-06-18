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

const allVideos = asyncHandler(async(req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [videos, total] = await Promise.all([
        Video.find({})
            .populate('owner', 'username avatar fullName')
            .skip(skip)
            .limit(limit),
        Video.countDocuments({})
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
        }, 'All Videos Fetched Successfully')
    )
})

// ...existing code...

const getVideoById = asyncHandler(async(req, res) => {
    const videoId = req.params.videoId;
    if(!videoId) {
        throw new ApiError(400, 'Video ID is required');
    }

    const video = await Video.findById(videoId).populate('owner', 'username avatar fullName');
    if(!video) {
        throw new ApiError(404, 'Video not found');
    }

    if(req.user._id.toString() !== video.owner._id.toString()) {
        video.views += 1; // Increment views only if the user is not the owner
        await video.save({ validateBeforeSave: true });
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
        await deleteFromCloudinary(video.filePath, 'video');
    } catch (error) {
        ApiError( 500, 'Failed to delete from Cloudinary');
    }
    await video.deleteOne()

    return res.status(200)
    .json(
        new ApiResponse(200, null, 'Video deleted successfully')
    );
})

export {
    uploadVideo,
    getAllUploadedVideos,
    allVideos,
    getVideoById,
    deleteVideo
}