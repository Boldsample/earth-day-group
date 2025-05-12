import useWebSocket from "react-use-websocket"
import { useDispatch, useSelector } from "react-redux"
import { createContext, useContext, useEffect, useState } from "react"

import { callNotifications } from "@store/slices/usersSlice"

const NotificationsContext = createContext()

export const NotificationsProvider = ({ children }) => {
  const dispatch = useDispatch()
  const [socketUrl, setSocketUrl] = useState(null)
  const user = useSelector((state) => state.users.userData)
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    reconnectAttempts: 1,
    reconnectInterval: 30000,
    shouldReconnect: () => true,
    onOpen: () => dispatch(callNotifications({user: user?.id}))
  })

  const sendNotificationMessage = (receiverId, message) => {
    if (!receiverId || !message) return;
    const data = JSON.stringify({ action: "notify", user_id: receiverId, message });
    sendMessage(data);
  };

  useEffect(() => {
    if (user?.id)
      setSocketUrl(`wss://api.earthdaygroup.com:8080?user_id=${user?.id}`);
  }, [user]);
  useEffect(() => {
    dispatch(callNotifications({user: user?.id}))
  }, [lastMessage]);

  return (
    <NotificationsContext.Provider value={{ sendNotificationMessage, readyState }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export const useNotifications = () => {
    return useContext(NotificationsContext);
}

export default NotificationsProvider