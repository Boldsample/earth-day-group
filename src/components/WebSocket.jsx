import { useEffect, useRef, useState } from "react";

const useWebSocket = (userId) => {
    const socketRef = useRef(null);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!userId) return; // Si no hay usuario, no conectamos WebSocket

        console.log(`🔌 Conectando WebSocket para el usuario ${userId}...`);

        socketRef.current = new WebSocket("wss://api.earthdaygroup.com:8080");

        socketRef.current.onopen = () => {
            console.log("✅ WebSocket conectado");

            // Enviar el user_id al backend para asociar la sesión
            socketRef.current.send(JSON.stringify({
                action: "register",
                user_id: userId
            }));
        };

        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("📩 Notificación recibida:", data);

            // Agregar notificación al estado
            setNotifications(prev => [...prev, data]);
        };

        socketRef.current.onerror = (error) => {
            console.error("❌ WebSocket Error:", error);
        };

        socketRef.current.onclose = () => {
            console.log("⚠️ WebSocket desconectado");
        };

        return () => {
            console.log("🔴 Cerrando WebSocket...");
            socketRef.current?.close();
        };
    }, [userId]); // Se ejecuta solo cuando cambia userId

    return { notifications };
};

export default useWebSocket;