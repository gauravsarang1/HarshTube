import { Schema, model } from "mongoose";

const playlistSchema = new Schema({
    name: {
        type: String,
        requird: true
    },
    description: {
        type: String,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    videos: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Video'
        }
    ]
},{timestamps: true})

export const Playlist = model('Playlist', playlistSchema)