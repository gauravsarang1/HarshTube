import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(import.meta.env.VITE_API_BASE_URL, {
            withCredentials: true,
        });

        newSocket.on("connect", () => {
            console.log("🔌 Connected:", newSocket.id);
        });
    
        newSocket.on("disconnect", () => {
            console.log("❌ Disconnected from server");
        });
    
        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}; 