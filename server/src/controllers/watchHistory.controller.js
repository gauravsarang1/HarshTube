import { WatchHistory } from "../models/watchHistory.model.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { hash } from "bcrypt";
import mongoose from "mongoose";


const addToWatchHistory = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId) {
        throw new ApiError(400, 'Video ID is required');
    }

    // 1️⃣ Check if video already in history
    const existingHistory = await WatchHistory.findOne({
        owner: req.user._id,
        video: videoId,
    });

    if (existingHistory) {
        existingHistory.watchedAt = new Date(); // update time
        existingHistory.progress = 0;           // reset progress
        await existingHistory.save({ validateBeforeSave: true });

        return res.status(200).json(
        new ApiResponse(200, existingHistory, 'Video already in history, updated')
        );
    }

    // 2️⃣ Add new history entry
    const watchHistory = await WatchHistory.create({
        owner: req.user._id,
        video: videoId,
        progress: 0
    });

    if (!watchHistory) {
        throw new ApiError(500, 'Failed to add to watch history');
    }

    // 3️⃣ Maintain only latest 50 items per user
    const total = await WatchHistory.countDocuments({ owner: req.user._id });
    if (total > 50) {
        const oldest = await WatchHistory.findOne({ owner: req.user._id })
        .sort({ watchedAt: 1 });

        if (oldest) {
        await oldest.deleteOne();
        }
    }

    return res.status(201).json(
        new ApiResponse(201, watchHistory, 'Added to watch history')
    );
});

const getWatchHistory = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const watchHistory = await WatchHistory.aggregate([
        {
            $match: { owner: new mongoose.Types.ObjectId(req.user._id) }
        },
        {
            $lookup: {
                from: 'videos',
                localField: 'video',
                foreignField: '_id',
                as: 'videoDetails',
                pipeline: [
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'owner',
                            foreignField: '_id',
                            as: 'ownerDetails',
                            pipeline: [
                                {
                                    $project: {
                                        username: 1,
                                        fullName: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    { $unwind: '$ownerDetails' },
                    {
                        $project: {
                            _id: 1,
                            title: 1,
                            thumbnail: 1,
                            duration: 1,
                            views: 1,
                            createdAt: 1,
                            owner: {
                                _id: '$ownerDetails._id',
                                fullName: '$ownerDetails.fullName',
                                avatar: '$ownerDetails.avatar'
                            }
                        }
                    }
                ]
            }
        },
        // Unwind but preserve empty if video is deleted
        {
            $unwind: {
                path: '$videoDetails',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                _id: 1,
                watchedAt: 1,
                progress: 1,
                videoId: '$videoDetails._id',
                title: '$videoDetails.title',
                thumbnail: '$videoDetails.thumbnail',
                owner: '$videoDetails.owner',
                duration: '$videoDetails.duration',
                views: '$videoDetails.views',
                createdAt: '$videoDetails.createdAt'
            }
        },
        {
            $sort: { watchedAt: -1 }
        },
        {
            $facet: {
                data: [
                    { $skip: skip },
                    { $limit: limit }
                ],
                totalCount: [
                    { $count: 'count' }
                ]
            }
        }
    ]);

    const totalCount = watchHistory[0].totalCount[0]?.count || 0;

    return res.status(200).json(
        new ApiResponse(200, {
            videos: watchHistory[0].data,
            totalCount,
            page,
            limit,
            totalPages: Math.ceil(totalCount / limit),
            hasMore: skip + watchHistory[0].data.length < totalCount
        }, 'Watch history fetched successfully')
    );
});


const deleteAllWatchHistory = asyncHandler(async (req, res) => {
    const deletedHistory = await WatchHistory.deleteMany({ owner: req.user._id });

    if (deletedHistory.deletedCount === 0) {
        throw new ApiError(404, 'No watch history found to delete');
    }

    return res.status(200).json(
        new ApiResponse(200, null, 'All watch history deleted successfully')
    );
});

const deleteSingleWatchHistory = asyncHandler(async (req, res) => {
    const { historyId } = req.params;

    if (!historyId) {
        throw new ApiError(400, 'Watch history ID is required');
    }

    const deletedHistory = await WatchHistory.findOneAndDelete({
        _id: historyId,
        owner: req.user._id
    });

    if (!deletedHistory) {
        throw new ApiError(404, 'Watch history not found');
    }

    return res.status(200).json(
        new ApiResponse(200, null, 'Watch history deleted successfully')
    );
});

export {
    addToWatchHistory,
    getWatchHistory,
    deleteAllWatchHistory,
    deleteSingleWatchHistory
};