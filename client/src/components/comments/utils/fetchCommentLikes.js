import api from '../../../api/axios';

const fetchCommentLikes = async ({ commentId }) => {
    try {
        const response = await api.get(`/comments/reactions/${commentId}`);
        return response.data.data || [];
    } catch (err) {
        console.error('Error fetching comment likes:', err);
        return [];
    }
}

export default fetchCommentLikes;