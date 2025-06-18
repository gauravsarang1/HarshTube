import {Schema, model} from "mongoose";

const watchHistorySchema = new Schema({
    video: {
        type: Schema.Types.ObjectId,
        ref: 'Video',
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    watchedAt: {
        type: Date,
        default: Date.now
    },
    progress: {
        type: Number,
        default: 0, // Progress in percentage
    }
});

watchHistorySchema.index({ owner: 1, video: 1 }, { unique: true });
export const WatchHistory = model('WatchHistory', watchHistorySchema);