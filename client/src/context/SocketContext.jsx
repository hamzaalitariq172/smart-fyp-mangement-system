import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (user) {
      if (!socketRef.current?.connected) {
        const newSocket = io(SOCKET_URL);
        socketRef.current = newSocket;
        setSocket(newSocket);

        newSocket.on('connect', () => {
          newSocket.emit('join', user._id);
        });

        newSocket.on('newMessage', (msg) => {
          if (msg.sender?._id !== user._id) {
            toast.success(`New message from ${msg.sender?.name || 'someone'}`, { icon: '💬', duration: 3000 });
          }
        });
      } else {
        socketRef.current.emit('join', user._id);
      }
      return () => {};
    } else {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
