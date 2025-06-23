import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { User} from '../models/user.model.js'
import { ApiResponse } from '../utils/ApiResponce.js'
import {uploadOnCloudinary} from '../utils/Cloudinary.js'
import jwt from 'jsonwebtoken'
import mongoose from "mongoose";
import { deleteFromCloudinary } from "../utils/deleteFromCloudinary.js";

const generateAccessTokenAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return { accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, 'Something went wrong when generating accessToken and refreshToken', error?.message || error)
    }
};

const registerUser = asyncHandler( async(req, res) => {
    //access data from frontend
    //check for empty fields
    //check for image, avatar
    //create object
    //sen to db
    //send responce to client

    const { username, email, password, fullName } = req.body

    if([username, email, password, fullName].some((fields) => 
        fields?.trim() === ''
    )) {
        throw new ApiError(401, 'All Fields Are Required')
    }

    const existUser = await User.findOne({
        $or: [{username}, {email}]
    })

    if(existUser) {
        throw new ApiError(409, 'User Already Exists')
    }

    if (!req.files || !req.files.avatar || !Array.isArray(req.files.avatar) || req.files.avatar.length === 0) {
        throw new ApiError(400, 'Avatar file is missing');
    }

    const avatarLocalPath = req.files.avatar[0].path;

    let coverImageLocalPath = '';

    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0 ) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    const avatarImageCloudpath = await uploadOnCloudinary(avatarLocalPath)
    const {response: avatar} = avatarImageCloudpath
    if(!avatar) {
        throw new ApiError(401, 'Error While Uploading Avatar')
    }

    const coverImageClaudePath = await uploadOnCloudinary(coverImageLocalPath)
    const {response: coverImage} = coverImageClaudePath || ''

    const createdUser = await User.create({
        username: username.toLowerCase(),
        email,
        fullName,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || ''
    })

    if(!createdUser) {
        throw new ApiError(500, 'Something went wrong while Registration')
    }

    const ResUser = await User.findById(createdUser._id).select('-password -refreshToken')

    return res.status(200).json(
        new ApiResponse(200, ResUser, 'SuccessFully Registered')
    )
});

const loginUser = asyncHandler(async(req, res) => {
    //req.body - data
    //check empty fields
    //check if is user exist or not not
    //send responce

    const { username, email, password } = req.body

    if( !username && !email ) {
        throw new ApiError( 401, 'All Fields Are Required')
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user) {
        throw new ApiError(404, 'No user found with this username or email')
    }

    const passwordMatch = await user.isPasswordCorrect(password)

    if(!passwordMatch) {
        throw new ApiError(401, 'Entered Wrong password')
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id)
    //console.log(`accessToken: ${accessToken} refreshToken: ${refreshToken}`)

    const loggedInUser = await User.findById(user._id).select('-password -refreshToken')

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                loggedInUser, accessToken
            },
            'login successfully'
        )
    )
});


const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    res.status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(
        new ApiResponse(200, {}, 'User Logged Out')
    )
});

const refreshAccessToken = asyncHandler(async(req, res) => {
    const incomingRefreshtoken = req.cookies?.refreshToken || req.body.refreshToken //
    
    if(!incomingRefreshtoken) {
        throw new ApiError(401, 'Unauthorized request')
    }
    //console.log('incomingRefreshToken', incomingRefreshtoken)
    try {
        
        const decodedToken = jwt.verify(incomingRefreshtoken, process.env.REFRESH_TOKEN_SECRET)
        //console.log('decodedToken', decodedToken)
    
        const user = await User.findById(decodedToken?._id)
    
        if(!user) {
            throw new ApiError(401, 'Invalid Refresh Token')
        }

        if(incomingRefreshtoken !== user.refreshToken) {
            throw new ApiError(401, "Refresh Token is used or expired")
        }
    
        const {accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id)
        //console.log(`accessToken: ${accessToken} <br> refreshToken: ${refreshToken}`)
    
        const options ={
            httpOnly: true,
            secure: true
        }
    
        res.status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken',refreshToken, options)
        .json(
            new ApiResponse(200, {accessToken, refreshToken}, 'Token refreshed Successfuly')
        )
    } catch (error) {
        throw new ApiError(401, 'Invalid refresh token', error)
    }
});

const updateCurrentPassword = asyncHandler(async(req, res) => {
    const { currentPassword, newPassword } = req.body
    if(!currentPassword || !newPassword) {
        throw new ApiError(401, 'currentPassword and newPassword Both fields are reqired')
    }
    const user = await User.findById(req.user._id).select("+password")
    console.log(user)
    const isPasswordValid = await user.isPasswordCorrect(currentPassword)

    if(!isPasswordValid) {
        throw new ApiError(401, 'current password is not matching')
    }

    user.password = newPassword
    await user.save({validateBeforeSave: true})

    res.status(200).json(
        new ApiResponse(200, {}, 'Password updated successfully')
    )
});

const updateCurrentAvatar = asyncHandler(async(req, res) => {
    const avatarLocalPath = req.file?.path

    if(!avatarLocalPath) {
        throw new ApiError(401, 'Avatar local path is empty')
    }

    const user = await User.findById(req.user._id)

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    if( user.avatar) {
        const cloudinaryUrl = user.avatar;
        // Extract correct public_id
        const relativePath = cloudinaryUrl.split('/upload/')[1]; // v1234/folder/filename.jpg
        const segments = relativePath.split('/');
        segments.shift(); // Remove version like "v12345678"
        const publicId = segments.join('/').split('.')[0];

        console.log('✅ Correct publicId:', publicId);

        await deleteFromCloudinary(publicId, 'image');
    }

    const newAvatar = await uploadOnCloudinary(avatarLocalPath)

    user.avatar = newAvatar.response.url
    await user.save({validateBeforeSave: true})

    res.status(200).json(
        new ApiResponse(200, {newAvatarUrl: newAvatar.url}, 'avatar updated successfully')
    )
})

const updateCurrentCoverImage = asyncHandler(async(req, res) => {
    const coverImageLocalPath = req.file?.path
    if(!coverImageLocalPath) {
        throw new ApiError(401, 'Cover image local path is empty')
    }

    // Find the user by ID
    // and ensure the user exists
    const user = await User.findById(req.user._id)
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    // Extract the current cover image publicId from the user
    if (user.coverImage) {
        const cloudinaryUrl = user.coverImage;

        // Extract correct public_id
        const relativePath = cloudinaryUrl.split('/upload/')[1]; // v1234/folder/filename.jpg
        const segments = relativePath.split('/');
        segments.shift(); // Remove version like "v12345678"
        const publicId = segments.join('/').split('.')[0];

        console.log('✅ Correct publicId:', publicId);

        await deleteFromCloudinary(publicId, 'image');
    }


    const newCoverImage = await uploadOnCloudinary(coverImageLocalPath)

    user.coverImage = newCoverImage.response.url
    await user.save({validateBeforeSave: true})

    res.status(200).json(
        new ApiResponse(200, {coverImageUrl: newCoverImage.url}, 'Cover image uploaded successfully')
    )
})

const updateAllDetails = asyncHandler(async(req, res) => {
    const {username, fullName, email} = req.body
    if(!(username || email || fullName)) {
        throw new ApiError(401, 'please select atleast 1 field')
    };

    const user = await User.findById(req.user._id)
    if (!user) {
        throw new ApiError(404, 'User not found');
    };

    if (username && username !== user.username) {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        throw new ApiError(409, 'Username already in use');
    }
    }
    if (email && email !== user.email) {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
        throw new ApiError(409, 'Email already in use');
    }
    }

    const updatedFields = {};

    if (username) updatedFields.username = username.toLowerCase().trim();
    if (fullName) updatedFields.fullName = fullName.trim();
    if (email) updatedFields.email = email.trim();

    // Update the user object with the new values
    Object.assign(user, updatedFields);

    await user.save({validateBeforeSave: true});

    res.status(200).json({
        success: true,
        updatedFields,
        message: "User details updated successfully",
    });
});

const getCurrentUser = asyncHandler(async( req, res) => {
    return res.status(200)
    .json(
        new ApiResponse(200, req.user, 'User fetched succesfully')
    )
});


const getUserChannelProfile = asyncHandler(async(req, res) => {
    const { username } = req.params;
    if(!username?.trim()) {
        throw new ApiError(400, 'Username is empty')
    }
    
    // Handle case where user is not authenticated
    const userId = req.user && mongoose.Types.ObjectId.isValid(req.user._id)
    ? new mongoose.Types.ObjectId(req.user._id)
    : null;

    const channel = await User.aggregate([
        {
            $match : {username: username?.toLowerCase().trim()}
        },
        {
            $lookup: {
                from: 'subscriptions',
                localField: '_id',
                foreignField: 'channel',
                as: 'subscribers'
            }
        },
        {
            $lookup: {
                from: 'videos',
                localField: '_id',
                foreignField: 'owner',
                as: 'videos',
                pipeline: [
                    {
                        $lookup: {
                            from: 'likes',
                            localField: '_id',
                            foreignField: 'video',
                            as: 'likes'
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: 'subscriptions',
                localField: '_id',
                foreignField: 'subscriber',
                as: 'subscribedTo'
            }
        },
        
        {
            $addFields: {
                subscribersCount: {
                    $size: '$subscribers'
                },
                channelSubscribedToCount: {
                    $size: '$subscribedTo'
                },
                totalVideos: {
                    $size: '$videos'
                },
                totalLikes: {
                    $sum: {
                        $map: {
                            input: '$videos',
                            as: 'video',
                            in: {
                                $size: {
                                    $filter: {
                                        input: '$$video.likes',
                                        as: 'like',
                                        cond: { $eq: ['$$like.type', 'like'] }
                                    }
                                }
                            }
                        }
                    }
                },
                totalViews: {
                    $sum: {
                        $map: {
                            input: '$videos',
                            as: 'video',
                            in: '$$video.views'
                        }
                    }
                },
                isSubscribed: {
                    $cond: {
                        if: {
                            $and: [
                                { $ne: [userId, null] },
                                {
                                    $in: [
                                        userId,
                                        {
                                            $map: {
                                                input: '$subscribers',
                                                as: 'sub',
                                                in: '$$sub.subscriber'
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                username: 1,
                fullName: 1,
                avatar: 1,
                coverImage: 1,
                email: 1,
                subscribersCount: 1,
                channelSubscribedToCount: 1,
                isSubscribed: 1,
                totalVideos: 1,
                totalLikes: 1,
                totalViews: 1
            }
        }
    ]);

    if(!channel?.length) {
        throw new ApiError(404, 'Channel could not found')
    }

    return res.status(200)
    .json(
        new ApiResponse(200, channel[0], 'Channel fetched successfully')
    )
})

const getWatchHistory = asyncHandler(async(req, res) => {
    const user = await User.aggregate([
        {
            $match: {_id: new mongoose.Types.ObjectId(req.user?._id)}  //converting a user-id string to a proper mongodb object                  
        },
        {
            $lookup: {
                from: 'videos',
                localField: 'watchHistory',
                foreignField: '_id',
                as: 'watchHistory',
                pipeline: [
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'owner',
                            foreignField: '_id',
                            as: 'owner',
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                                
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: '$owner'
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res.status(200)
    .json(
        new ApiResponse(200, user[0].watchHistory, 'WatchHistory fetched successfully')
    )
})


const getUsersByUsername = asyncHandler(async(req, res) => {
    const username = req.query.q;    
    if(!username) {
        throw new ApiError(400, 'Username is required');
    }

    const users = await User.find({ username: { $regex: username, $options: 'i' } });
    if(!users || users.length === 0) {
        return res.status(200).json(new ApiResponse(200, [], 'No users found'));
    }

    return res.status(200)
    .json(new ApiResponse(200, users, 'Users fetched successfully'));
})


export { 
    registerUser, 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    updateCurrentPassword, 
    updateCurrentAvatar, 
    updateCurrentCoverImage,
    updateAllDetails,
    getCurrentUser,
    getUserChannelProfile,
    getWatchHistory,
    getUsersByUsername
}