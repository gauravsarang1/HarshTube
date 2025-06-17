import mongoose, {isValidObjectId, Mongoose} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/ApiResponce.js"
import asyncHandler from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import { Video } from "../models/video.model.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    if(!(name && description)) {
        throw new ApiError(400, 'Both name and desciption are required')
    }
    
    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id,
        videos: [
            
        ]
    })
    if(!playlist) {
        throw new ApiError(500, 'Error Occured While creating playlist')
    }

    return res.status(201)
    .json(
        new ApiResponse(201, playlist, 'New Playlist created successfully')
    )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {username} = req.params
    if(!username) {
        throw new ApiError(400, 'UserId is required')
    }

    const user = await User.findOne({
        username: username
    })
    if(!user) { 
        throw new ApiError(404, 'User not found')
    }

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    /*const [AllUserPlaylists, total] = await Promise.all([
        Playlist.find({owner: user._id})
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit),
        Playlist.countDocuments({owner: user._id})
    ])

    if(AllUserPlaylists.length === 0) {
        throw new ApiError(404, 'no playlists found')
    }*/

    const result = await Playlist.aggregate([
        {
            $match: { owner: user._id }
        },
        {
            $sort: { createdAt: -1 }
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
            $lookup: {
                from: 'videos',
                localField: 'videos',
                foreignField: '_id',
                as: 'videos'
            }
        },
        {
            $addFields: {
                PlaylistThumbnail: {
                    $ifNull: [
                        { $arrayElemAt: ['$videos.thumbnail', 0] },
                        null
                    ]
                }
            }
        },
        {
            $project: {
                name: 1,
                createdAt: 1,
                updatedAt: 1,
                PlaylistThumbnail: 1,
                videos: {
                    $map: {
                        input: '$videos',
                        as: 'video',
                        in: {
                            _id: '$$video._id',
                        }
                    }
                },
                owner: {
                    _id: '$owner._id',
                    username: '$owner.username',
                    avatar: '$owner.avatar',
                    fullName: '$owner.fullName'
                }
            }
        }
        ,
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
    ])

    if(result.length === 0) {
        throw new ApiError(404, 'no playlists found')
    }

    return res.status(200)
    .json(
        new ApiResponse(200, {
            playlists: result[0].data,
            page,
            limit,
            totalPages: Math.ceil(result[0].totalCount[0].count / limit),
            totalPlaylists: result[0].totalCount[0].count,
            hasMore: skip + result[0].data.length < result[0].totalCount[0].count
        }, 'All user playlists fetched successfully')
    )
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    if(!playlistId) {
        throw new ApiError(400, 'playlist id is required')
    }

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const [playlist] = await Promise.all([
        Playlist.find({
            _id: playlistId
        })
            .populate('owner', 'username avatar fullName')
            .populate('videos', 'title thumbnail description duration views createdAt')
            .limit(limit)
            .skip(skip)
            .sort({createdAt: -1})
    ])

    if(!playlist) {
        throw new ApiError(404, 'Playlist not found')
    }

    const totalVideos = playlist[0]?.videos?.length || 0

    return res.status(200)
    .json(
        new ApiResponse(200, {
            playlist: playlist[0],
            page,
            limit,
            totalPages: Math.ceil(totalVideos / limit),
            totalVideos: totalVideos,
        }, 'Playlist Fetched Successfully')
    )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if(!(playlistId && videoId)) {
        throw new ApiError(400, 'playlist and video id is required')
    }

    const playlist = await Playlist.findById(playlistId)
    if(!playlist) {
        throw new ApiError(404, 'Playlist not found')
    }

    if(!playlist.videos.includes(videoId)) {
        playlist.videos.push(videoId)
        await playlist.save({validateBeforeSave: true})
    }

    return res.status(200)
    .json(
        new ApiResponse(200, playlist, 'Video added to playlist successfully')
    )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if(!(playlistId && videoId)) {
        throw new ApiError(400, 'playlist and video id is required')
    }

    const playlist = await Playlist.findById(playlistId)
    if(!playlist) {
        throw new ApiError(404, 'Playlist not found')
    }

    const isPresent = playlist.videos.some( video => video.toString() === videoId.toString())

    if(!isPresent) {
        throw new ApiError(404, 'Video is not found in playlist')
    } 

    playlist.videos = playlist.videos.filter( video => video.toString() !== videoId.toString())
    await playlist.save({validateBeforeSave: true})

    return res.status(200)
    .json(
        new ApiResponse(200, playlist, 'Video removed from playlist successfully')
    )

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    if(!playlistId) {
        throw new ApiError(400, 'playlist id is required')
    }

    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId)
    if(!deletePlaylist) {
        new ApiError(500, 'something went wrong while deleting playlist')
    }

    return res.status(200)
    .json(
        new ApiResponse(200, null, 'Playlist deleted successfully')
    )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    if(!playlistId) {
        throw new ApiError(400, 'playlist id is required')
    }

    const {name, description} = req.body
    if(!(name && description )) {
        throw new ApiError(400, 'name and description are required')
    }
    
    const playlist = await Playlist.findById(playlistId)
    if(!playlist) {
        throw new ApiError(404, 'Playlist not found')
    }

    playlist.name = name
    playlist.description = description
    await playlist.save({validateBeforeSave: true})

    return res.status(200)
    .json(
        new ApiResponse(200, playlist, 'Playist updated successfully')
    )
})

const AllUserPlaylists = asyncHandler(async (req, res) => {
    const {username} = req.params
    if(!username) {
        throw new ApiError(400, 'UserId is required')
    }

    const user = await User.findOne({
        username: username
    })
    if(!user) { 
        throw new ApiError(404, 'User not found')
    }
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const result = await Playlist.aggregate([
        {
            $match: { owner: user._id }
        },
        {
            $sort: { createdAt: -1 }
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
            $lookup: {
            from: 'videos',
            localField: 'videos',
            foreignField: '_id',
            as: 'videos'
            }
        },
        {
            $addFields: {
            PlaylistThumbnail: {
                $ifNull: [
                { $arrayElemAt: ['$videos.thumbnail', 0] },
                null
                ]
            }
            }
        },
        {
            $project: {
            name: 1,
            createdAt: 1,
            updatedAt: 1,
            PlaylistThumbnail: 1,
            videos: {
                $map: {
                input: '$videos',
                as: 'video',
                in: {
                    _id: '$$video._id',
                    title: '$$video.title',
                    thumbnail: '$$video.thumbnail',
                    duration: '$$video.duration',
                    views: '$$video.views'
                }
                }
            },
            owner: {
                _id: '$owner._id',
                username: '$owner.username',
                avatar: '$owner.avatar',
                fullName: '$owner.fullName'
            }
            }
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

    if(result.length === 0) {
        throw new ApiError(404, 'no playlists found')
    }

    return res.status(200)
    .json(
        new ApiResponse(200, {
            playlists: result[0].data,
            page,
            limit,
            totalPages: Math.ceil(result[0].totalCount[0].count / limit),
            totalPlaylists: result[0].totalCount[0].count,
            hasMore: skip + result[0].data.length < result[0].totalCount[0].count
        }, 'All user playlists fetched successfully')
    )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}