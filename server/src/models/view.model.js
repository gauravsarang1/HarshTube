import mongoose, {Schema, model} from "mongoose";

const viewSchema = new Schema({
    videoId: {
        type: Schema.Types.ObjectId,
        ref: "Video",
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
},{timestamps: true})

export const View = model("View", viewSchema);