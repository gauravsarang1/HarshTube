import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isActive: false,
    currentTime: 0,
    videoSrc: '',
    videoId: '',
};

const miniPlayerSlice = createSlice({
    name: 'miniPlayer',
    initialState,
    reducers: {
        setIsActive: (state, action) => {
            state.isActive = action.payload;
        },
        setCurrentTime: (state, action) => {
            state.currentTime = action.payload;
            state.lastVideoTime = action.payload;
        },
        setVideoSrc: (state, action) => {
            state.videoSrc = action.payload;
        },
        setVideoId: (state, action) => {
            state.videoId = action.payload;
        },
        resetPlayer: (state) => {
            state.isActive = false;
            state.videoSrc = '';
            state.currentTime = 0;
        }
    },
});

export const { setIsActive, setCurrentTime, setVideoSrc, setVideoId, resetPlayer } = miniPlayerSlice.actions;
export default miniPlayerSlice.reducer;