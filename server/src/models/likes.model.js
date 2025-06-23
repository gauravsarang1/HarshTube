import { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const likesSchema = new Schema({
    video: {
        type: Schema.Types.ObjectId,
        ref: 'Video'
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },
    tweet: {
        type: Schema.Types.ObjectId,
        ref: 'Tweet'
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: String,
        default: 'like'
    }
}, {timestamps: true})

likesSchema.plugin(mongooseAggregatePaginate)

export const Like = model('Like', likesSchema)