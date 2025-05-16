import { useDispatch, useSelector } from "react-redux"
import useWebSocket, { ReadyState } from "react-use-websocket"
import { createContext, useContext, useEffect, useState } from "react"

import { callNotifications } from "@store/slices/usersSlice"

const NotificationsContext = createContext()

export const NotificationsProvider = ({ children }) => {
  const dispatch = useDispatch()
  const [socketUrl, setSocketUrl] = useState(null)
  const user = useSelector((state) => state.users.userData)
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    reconnectAttempts: Infinity,
    reconnectInterval: 20000,
    shouldReconnect: () => true,
    onOpen: () => dispatch(callNotifications({user: user?.id}))
  })

  const sendNotificationMessage = (receiverId, message) => {
    if (!receiverId || !message) return;
    const data = JSON.stringify({ action: "notify", user_id: receiverId, message });
    if (readyState === ReadyState.OPEN)
      sendMessage(data);
    else
      console.warn("⚠️ WebSocket aún no está abierto");
  };

  useEffect(() => {
    if (user?.id)
      setSocketUrl(`wss://api.earthdaygroup.com/ws/?user_id=${user?.id}`);
  }, [user]);
  useEffect(() => {
    if (user?.id)
      dispatch(callNotifications({user: user?.id}))
  }, [lastMessage]);

  return (
    <NotificationsContext.Provider value={{ sendNotificationMessage }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export const useNotifications = () => {
    return useContext(NotificationsContext);
}

export default NotificationsProvider