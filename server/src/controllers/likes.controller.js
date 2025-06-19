import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/likes.model.js"
import {ApiError} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/ApiResponce.js"
import asyncHandler from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const toggleVideoReaction = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { reactionType } = req.query; // 'like' or 'disLike'

    if (!videoId) {
        throw new ApiError(400, 'Video ID is required');
    }

    if (!['like', 'disLike'].includes(reactionType)) {
        throw new ApiError(400, 'Reaction type must be either "like" or "disLike"');
    }

    const oppositeType = reactionType === 'like' ? 'disLike' : 'like';

    // Remove the opposite reaction (if exists)
    await Like.findOneAndDelete({
        owner: req.user._id,
        video: videoId,
        type: oppositeType
    });

    // Toggle the same reaction
    const removedSame = await Like.findOneAndDelete({
        owner: req.user._id,
        video: videoId,
        type: reactionType
    });

    if (removedSame) {
        return res.status(200).json(
            new ApiResponse(200, null, `${reactionType} removed successfully`)
        );
    }
    
    // Create new reaction
    const newReaction = await Like.create({
        owner: req.user._id,
        video: videoId,
        type: reactionType
    });

    return res.status(201).json(
        new ApiResponse(201, newReaction, `Video ${reactionType}d successfully`)
    );
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    
    if(!commentId) {
        throw new ApiError(400, 'commentId id is required')
    }

    const unLikeComment = await Like.findOneAndDelete({
        owner: req.user._id,
        comment: commentId
    })
    if(unLikeComment) {
        return res.status(200)
        .json(
            new ApiResponse(200, {type: 'unLike', owner: req.user._id}, 'Comment unliked successfully')
        )
    }

    const likeComment = await Like.create({
        owner: req.user._id,
        comment: commentId
    })
    if(likeComment) {
        return res.status(201)
        .json(
            new ApiResponse(201, likeComment,  'comment liked successfully')
        )
    }

})

const getAllCommentLikes = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    if (!commentId) {
        throw new ApiError(400, 'Comment ID is required to fetch likes');
    }
    const allLikes = await Like.aggregate([
        {
            $match: {
                comment: new mongoose.Types.ObjectId(commentId),
                type: 'like'
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'likedBy',
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
        { $unwind: '$likedBy' },
        {
            $project: {
                _id: 0,
                likedById: '$likedBy._id',
                likedByName: '$likedBy.fullName',
                likedByUser: '$likedBy.username',
                likedByAvatar: '$likedBy.avatar'
            }
        }
    ]);
    return res.status(200).json(
        new ApiResponse(200, allLikes, 'All comment likes fetched successfully')
    );
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    
    if(!tweetId) {
        throw new ApiError(400, 'commentId id is required')
    }

    const unLikeTweet = await Like.findOneAndDelete({
        owner: req.user._id,
        tweet: tweetId
    })
    if(unLikeTweet) {
        return res.status(200)
        .json(
            new ApiResponse(200, null, 'tweet unliked successfully')
        )
    }

    const likeTweet = await Like.create({
        owner: req.user._id,
        tweet: tweetId
    })
    if(likeTweet) {
        return res.status(200)
        .json(
            new ApiResponse(201, likeTweet,  'Tweet liked successfully')
        )
    }
}
)

const deleteAllVideosLiked = asyncHandler(async (req, res) => {
    await Like.deleteMany({
        owner: req.user._id,
        type: 'like',
        video: {
            $exists: true
        }
    })
    return res.status(200).json(
        new ApiResponse(200, null, 'All videos liked deleted successfully')
    )
})

const getAllVideoLikes = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId) {
        throw new ApiError(400, 'Video ID is required to fetch likes');
    }

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, 'Invalid Video ID format');
    }

    const allLikes = await Like.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId),
                type: 'like'
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'likedBy',
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
        { $unwind: '$likedBy' },
        {
            $project: {
                _id: 0,
                likedById: '$likedBy._id',
                likedByName: '$likedBy.fullName',
                likedByUser: '$likedBy.username',
                likedByAvatar: '$likedBy.avatar'
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, allLikes, 'All video likes fetched successfully')
    );
});

const getAllVideoDislikes = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId) {
        throw new ApiError(400, 'Video ID is required to fetch dislikes');
    }

    const allDislikes = await Like.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId),
                type: 'disLike'
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'dislikedBy',
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
        { $unwind: '$dislikedBy' },
        {
            $project: {
                _id: 0,
                dislikedById: '$dislikedBy._id',
                dislikedByName: '$dislikedBy.fullName',
                dislikedByUser: '$dislikedBy.username',
                dislikedByAvatar: '$dislikedBy.avatar',
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, allDislikes, 'All video dislikes fetched successfully')
    );
});

const getAllLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 100; // Default to 100 liked videos
    const skip = (page - 1) * limit;

    const likedVideos = await Like.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
                type: 'like'
            }
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
                    {
                        $unwind: '$ownerDetails'
                    },
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
        { $unwind: '$videoDetails' },
        {
            $project: {
                _id: 0,
                videoId: '$videoDetails._id',
                title: '$videoDetails.title',
                thumbnail: '$videoDetails.thumbnail',
                createdAt: '$videoDetails.createdAt',
                duration: '$videoDetails.duration',
                views: '$videoDetails.views',
                owner: {
                    _id: '$videoDetails.owner._id',
                    fullName: '$videoDetails.owner.fullName',
                    avatar: '$videoDetails.owner.avatar'
                }
            }
        },
        {
            $sort: {
                createdAt: -1 // Sort by creation date, most recent first
            }
        },
        {
            $facet: {
                data: [
                    { $skip: skip }, // Skip 0 documents (you can implement pagination here)
                    { $limit: limit } // Limit to 100 liked videos (you can adjust this)
                ],
                totalCount: [
                    { $count: 'count' } // Count total liked videos
                ]
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, {
            videos: likedVideos[0].data,
            totalCount: likedVideos[0].totalCount.length > 0 ? likedVideos[0].totalCount[0].count : 0,
            currentPage: page,
            totalPages: Math.ceil((likedVideos[0].totalCount.length > 0 ? likedVideos[0].totalCount[0].count : 0) / limit)
        }, 'All liked videos fetched successfully')
    );
});


export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoReaction,
    getAllVideoLikes,
    getAllVideoDislikes,
    getAllCommentLikes,
    getAllLikedVideos,
    deleteAllVideosLiked
}