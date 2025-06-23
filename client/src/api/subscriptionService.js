import api from './axios';

export const subscriptionService = {
    // Toggle subscription (subscribe/unsubscribe)
    toggleSubscription: async (channelId) => {
        const response = await api.post(`/subscription/toggle/sub/${channelId}`);
        return response.data.data;
    },

    // Get channel subscribers
    getChannelSubscribers: async (channelId) => {
        const response = await api.get(`/subscription/get/user/subscribers/${channelId}`);
        return response.data.data;
    },

    // Get user's subscribed channels
    getSubscribedChannels: async (userId) => {
        const response = await api.get(`/subscription/get/user/subscribedTo/${userId}`);
        return response.data.data;
    }
}; 