import { Server } from "socket.io";

/** Función para registar el socket de notificaciones para comunicación en tiempo real */
export const registerNotificationSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("🟢 Cliente conectado:", socket.id);

    // Enviar bienvenida o notificaciones iniciales
    socket.emit(
      "notifications:connected",
      "Conectado al servidor de notificaciones"
    );

    // Escuchar cuando un cliente pida recargar
    socket.on("notifications:fetch", () => {
      console.log("📩 Cliente solicitó notificaciones");
    });

    socket.on("disconnect", () => {
      console.log("🔴 Cliente desconectado:", socket.id);
    });
  });
};
