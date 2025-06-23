import api from '../../../api/axios';

export const improveComment = async (title, userComment, otherComments) => {
    if (!userComment?.trim()) {
        throw new Error('Comment is required');
    }
    
    try {
        const response = await api.post('/ai/improve-comment', {
            title: title || '',
            comment: userComment.trim(),
            others: Array.isArray(otherComments) ? otherComments.filter(c => c && typeof c === 'string') : []
        });
        
        if (!response.data?.data) {
            throw new Error('Invalid response from server');
        }
        
        return response.data.data;
    } catch (error) {
        console.error('Error improving comment:', error.response?.data || error.message);
        throw error;
    }
};
