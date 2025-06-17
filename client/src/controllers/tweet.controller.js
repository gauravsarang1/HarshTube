import asyncHandler from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiErrors.js'
import {ApiResponse} from '../utils/ApiResponce.js'
import { Tweet } from '../models/tweet.model.js'

const postTweet = asyncHandler(async(req, res) => {
    
    const content = req.body?.content

    if(!content || content.trim().length === 0) {
        throw new ApiError(400, 'Content can not be empty')
    }

    const tweet = await Tweet.create({
        content: content.trim(),
        owner: req.user?._id
    })

    return res.status(201)
    .json(
        new ApiResponse(201, tweet, 'Tweet posted successfully')
    )
})

const deleteTweet = asyncHandler(async(req, res) => {
    const  tweetId  = req.params.deleteTweet  // or const { deleteTweet } = req.deleteTweet

    if(!tweetId) {
        throw new ApiError(400, 'Tweet id is required')
    }

    const tweet = await Tweet.findById(tweetId)

    if (!tweet) {
        throw new ApiError(404, 'Tweet not found');
    }

    if(req.user._id.toString() !== tweet.owner.toString()) {
        throw new ApiError(403, 'You are not allowed to delete this tweet')
    }

    await tweet.deleteOne()

    return res.status(200)
    .json(
        new ApiResponse(200, {}, 'Tweet deleted successfully')
    )
})

const editTweet = asyncHandler(async(req, res) => {
    const tweetId = req.params.editTweet
    if(!tweetId) {
        throw new ApiError(400, 'tweet id  is required')
    }

    const { content } = req.body
    if(!content) {
        throw new ApiError(400, 'Content is required')
    }

    const tweet = await Tweet.findById(tweetId)

    if(req.user._id.toString() !== tweet.owner.toString()) {
        throw new ApiError(403, 'You are not allowed to edit these tweet')
    }

    const updatedTweet = await Tweet.findById(
        tweetId,
    )
    tweet.content = content
    await tweet.save({validateBeforeSave: true})

    if(!updatedTweet) {
        throw new ApiError(500, 'Something went wrong while udating thee tweet')
    }

    return res.status(200)
    .json(
        new ApiResponse(200, updatedTweet, 'Tweet updated successfully')
    )

})
export { postTweet, deleteTweet, editTweet}