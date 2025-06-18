import mongoose, { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({
    filePath: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
    },
    duration: {
        type: Number,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    }
},{timestamps: true})

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = model('Video', videoSchema) 

/*const aggregate = Video.aggregate([
    {$match: {isPublished: true}},
    {$sort: {title: 1}}
])

const options = {
    page: 1,
    limit: 10
}

Video.aggregatePaginate(aggregate, options).then((result) => {
    console.log(result)
})
.catch(err => {
    console.error("Pagination error:", err);
}); */