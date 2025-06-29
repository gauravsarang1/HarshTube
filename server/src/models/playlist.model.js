import { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

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

playlistSchema.plugin(mongooseAggregatePaginate)

export const Playlist = model('Playlist', playlistSchema)