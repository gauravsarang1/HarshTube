import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/ApiResponce.js"
import asyncHandler from "../utils/asyncHandler.js"
import mongoose from "mongoose"

const toggleSubscription = asyncHandler(async(req, res) => {
    const channelId = req.params.channelId
    if(!channelId) {
        throw new ApiError(400, 'Channel id is required')
    }

    const user = await User.findById(channelId)
    if(!user) {
        throw new ApiError(404, 'Channel is not found')
    }

    const deleteSubscription = await Subscription.findOneAndDelete({
        subscriber: req.user._id,
        channel: channelId
    })

    if(deleteSubscription) {
        return res.status(200)
        .json(
            new ApiResponse(200,null, 'Unsubscribed successfully')
        )
    }

    const newSubscription = await Subscription.create({
        subscriber: req.user._id,
        channel: channelId
    })

    if(newSubscription) {
        return res.status(201)
        .json(
            new ApiResponse(201,newSubscription,'subscribed Successfully')
        )
    }
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if(!channelId) {
        throw new ApiError(400, 'Channel id is required')
    }

    const user = await User.findById(channelId)
    if(!user) {
        throw new ApiError(404, 'Channel is not found')
    }

    const userId = req.user._id //mongoose.Types.ObjectId.isValid(req.user._id) ? new mongoose.Types.ObjectId(req.user._id): null;

    const channel =  await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'subscriber',
                foreignField: '_id',
                as: 'subscriberDetails',
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
            $unwind: '$subscriberDetails'
        },
        {
            $project: {
                _id: 0,
                subscriberId: '$subscriberDetails._id',
                username: '$subscriberDetails.username',
                fullName: '$subscriberDetails.fullName',
                avatar: '$subscriberDetails.avatar',
            }
        }
    ])

    const totalSubscribers = await Subscription.countDocuments({
        channel: userId
    })

    const isSubscribed = await Subscription.exists({
        subscriber: userId,
        channel: channelId
    })

    return res.status(200)
    .json(
        new ApiResponse(200, {
            channel,
            totalSubscribers,
            isSubscribed: !!isSubscribed
        }, 'All Subscribers fetched successfully')
    )
})


const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if(!subscriberId) {
        throw new ApiError(400, 'Channel id is required')
    }

    const user = await User.findById(subscriberId)
    if(!user) {
        throw new ApiError(404, 'Channel is not found')
    }

    const subscriber =  await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(subscriberId)
            }
        },{
            $lookup: {
                from: 'users',
                localField: 'channel',
                foreignField: '_id',
                as: 'subscribedToDetails',
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
            $unwind: '$subscribedToDetails'
        },
        {
            $project: {
                _id: 0,
                channelId: '$subscribedToDetails._id',
                username: '$subscribedToDetails.username',
                fullName: '$subscribdTorDetails.fullName',
                avatar: '$subscribedToDetails.avatar'
            }
        }
    ])

    return res.status(200)
    .json(
        new ApiResponse(200, subscriber, 'All channels fetched successfully')
    )
})

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels }