import mongoose, { mongo } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import asyncHandler from "../utils/asyncHandler.js";

const addComment = asyncHandler(async(req, res) => {
    const  content  = req.body.content
    if(!content) {
        throw new ApiError(400, 'Content is required')
    }

    const videoId = req.params.videoId
    if(!videoId) {
        throw new ApiError(404, 'Video id not found')
    }

    const comment = await Comment.create({
        content: content.trim(),
        owner: req.user._id,
        video: new mongoose.Types.ObjectId(videoId)
    })

    // Populate owner details for the response
    const populatedComment = await Comment.aggregate([
        { $match: { _id: comment._id } },
        {
            $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'owner'
            }
        },
        { $unwind: '$owner' },
        {
            $project: {
                content: 1,
                createdAt: 1,
                updatedAt: 1,
                owner: {
                    _id: '$owner._id',
                    name: '$owner.username',
                    fullName: '$owner.fullName',
                    avatar: '$owner.avatar'
                }
            }
        }
    ]);

    return res.status(200)
    .json(
        new ApiResponse(201, populatedComment[0], 'Comment added successfully')
    )
});

const updateComment = asyncHandler(async(req, res) => {
    const content = req.body.content
    if(!content) {
        throw new ApiError(400, 'comment is required')
    }
    
    const CommentId = req.params.commentId
    if(!CommentId) {
        throw new ApiError(400, 'CommentId id is required')
    }

    const comment = await Comment.findById(CommentId)
    if(!comment) {
        throw new ApiError(404, 'comment not found')
    }

    comment.content = content.trim()
    await comment.save({validateBeforeSave: true})

    return res.status(200)
    .json(
        new ApiResponse(200, comment, 'Comment udateded successfully')
    )
})

const deleteComment = asyncHandler(async(req, res) => {
    const CommentId = req.params.commentId
    if(!CommentId) {
        throw new ApiError(400, 'CommentId id is required')
    }

    const comment = await Comment.findById(CommentId)
    if(!comment) {
        throw new ApiError(404, 'comment not found')
    }

    if(comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, 'You Are not allowed to delete this comment')
    }

    await comment.deleteOne()

    return res.status(200)
    .json(
        new ApiResponse(200, comment, 'Comment deleted successfully')
    )
})

const getAllComments = asyncHandler(async (req, res) => {
    const videoId = req.params.videoId;

    if (!videoId) {
        throw new ApiError(404, 'Video id not found');
    }

    const comments = await Comment.aggregate([
        {
            $match: { video: new mongoose.Types.ObjectId(videoId) }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'owner'
            }
        },
        {
            $unwind: '$owner'
        },
        {
            $sort: { createdAt: -1 }
        },
        {
            $lookup: {
                from: 'likes',
                localField: '_id',
                foreignField: 'comment',
                as: 'likes'
            }
        },
        {
            $project: {
                content: 1,
                createdAt: 1,
                updatedAt: 1,
                owner: {
                    _id: '$owner._id',
                    name: '$owner.username',
                    fullName: '$owner.fullName',
                    avatar: '$owner.avatar'
                },
                likes: 1
            }
        }
    ]);

    // Now add isLiked and totalLikes in plain JS
    const enhancedComments = comments.map(comment => {
        const totalLikes = comment.likes.length;
        const isLiked = comment.likes.some(like =>
            like.owner.toString() === req.user._id.toString()
        );
        return {
            ...comment,
            totalLikes,
            isLiked
        };
    });

    return res.status(200).json(
        new ApiResponse(200, enhancedComments, 'Comments fetched successfully')
    );
});

export { addComment, updateComment, deleteComment, getAllComments };