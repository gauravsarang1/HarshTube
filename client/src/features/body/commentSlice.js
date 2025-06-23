import { createSlice } from "@reduxjs/toolkit";

const commentSlice = createSlice({
    name: 'comment',
    initialState: {
        comments: [],
        loading: true,
        error: null,
        submitType: {type: 'send', commentId: null},
        newComment: '',
        submitting: false,
        commentlikedUser: [],
        currentUser: null,
        videoId: null,
        videoTitle: null,
        lastFiveComments: [],
    },
    reducers: {
        setComments: (state, action) => {
            state.comments = action.payload;
            state.lastFiveComments = action.payload.slice(0, 5);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setSubmitType: (state, action) => {
            state.submitType = action.payload;
        },
        setNewComment: (state, action) => {
            state.newComment = action.payload;
        },
        setSubmitting: (state, action) => {
            state.submitting = action.payload;
        },
        setCommentlikedUser: (state, action) => {
            state.commentlikedUser = action.payload;
        },
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;
        },
        setVideoId: (state, action) => {
            state.videoId = action.payload;
        },
        setVideoTitle: (state, action) => {
            state.videoTitle = action.payload;
        },
        setLastFiveComments: (state, action) => {
            state.lastFiveComments = action.payload;
        }
    }
})

export const { setComments, setLoading, setError, setSubmitType, setNewComment, setSubmitting, setCommentlikedUser, setCurrentUser, setVideoId, setVideoTitle, setLastFiveComments } = commentSlice.actions;
export default commentSlice.reducer;