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
    },
    reducers: {
        setComments: (state, action) => {
            state.comments = action.payload;
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
    }
})

export const { setComments, setLoading, setError, setSubmitType, setNewComment, setSubmitting, setCommentlikedUser, setCurrentUser, setVideoId } = commentSlice.actions;
export default commentSlice.reducer;