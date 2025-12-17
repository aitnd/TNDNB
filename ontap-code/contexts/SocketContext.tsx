import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const { user, loading } = useAuth();

    useEffect(() => {
        if (loading) return;

        let newSocket: Socket | null = null;

        const connectSocket = async () => {
            if (user) {
                try {
                    const token = await user.getIdToken();
                    // Use env var for production, fallback to localhost for dev
                    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
                    newSocket = io(socketUrl, {
                        autoConnect: true,
                        query: { token: token }
                    });

                    newSocket.on('connect', () => {
                        console.log('Socket Connected:', newSocket?.id);
                        setIsConnected(true);
                    });

                    newSocket.on('disconnect', () => {
                        console.log('Socket Disconnected');
                        setIsConnected(false);
                    });

                    newSocket.on('connect_error', (err) => {
                        console.error('Socket Connection Error:', err);
                    });

                    setSocket(newSocket);
                } catch (error) {
                    console.error("Failed to get token for socket:", error);
                }
            } else {
                if (socket) {
                    socket.disconnect();
                    setSocket(null);
                    setIsConnected(false);
                }
            }
        };

        connectSocket();

        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, [user, loading]);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
