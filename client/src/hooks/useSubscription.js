import { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { subscriptionService } from '../api/subscriptionService';
import { useSelector } from 'react-redux';

export const useSubscription = (channelId) => {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscriberCount, setSubscriberCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const socket = useSocket();
    const currentUser = useSelector(state => state.currentUser.currentUser);

    // Fetch initial subscription data
    useEffect(() => {
        const fetchSubscriptionData = async () => {
            if (!channelId) return;
            
            try {
                setLoading(true);
                const data = await subscriptionService.getChannelSubscribers(channelId);
                setIsSubscribed(data.isSubscribed);
                setSubscriberCount(data.totalSubscribers);
                setError(null);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching subscription data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSubscriptionData();
    }, [channelId]);

    // Listen for subscription updates
    useEffect(() => {
        if (!socket || !channelId) return;

        const handleSubscriptionUpdate = (data) => {
            // Update subscriber count for all clients watching the channel
            if (data.channelId === channelId) {
                setSubscriberCount(data.totalSubscribers);
                
                // Only update isSubscribed state if the event is for the current user
                if (currentUser?.id === data.subscriberId) {
                    setIsSubscribed(data.isSubscribed);
                }
            }
        };

        socket.on('subscription-updated', handleSubscriptionUpdate);

        return () => {
            socket.off('subscription-updated', handleSubscriptionUpdate);
        };
    }, [socket, channelId, currentUser]);

    // Toggle subscription
    const toggleSubscription = async () => {
        if (!currentUser) {
            setError('You must be logged in to subscribe');
            throw new Error('Authentication required');
        }

        try {
            setLoading(true);
            const data = await subscriptionService.toggleSubscription(channelId);
            // Let the socket event handle the state updates
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        isSubscribed,
        subscriberCount,
        loading,
        error,
        toggleSubscription
    };
}; 