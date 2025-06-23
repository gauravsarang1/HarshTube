import { View } from "../models/view.model.js";
import  asyncHandler  from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponce.js";

const addView = asyncHandler(async (req, res) => {
    const {videoId} = req.params;
    const userId = req.user._id;

    const existingView = await View.findOne({videoId, userId});

    if(existingView){
        return res.status(200).json(new ApiResponse(200, existingView, "View already exists"));
    }

    const view = await View.create({videoId, userId});

    if(!view){
        throw new ApiError(500, "Failed to add view");
    }

    const io = req.app.get("io");
    io.emit("views-updated", {videoId});

    return res.status(200).json(new ApiResponse(200, view, "View added successfully"));
});

const getVideoViews = asyncHandler(async (req, res) => {
    const {videoId} = req.params;
    const views = await View.find({videoId});

    if(!views){
        throw new AppError(404, "No views found");
    }

    const totalViews = views.length;
    const isViewed = views.some(view => view.userId.toString() === req.user?._id.toString());

    return res.status(200).json(new ApiResponse(200, {totalViews, isViewed}, "Views fetched successfully"));
});

export {addView, getVideoViews};