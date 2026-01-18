import { Server as IOServer } from "socket.io";

let io: IOServer | null = null;

/**
    * Establece la instancia del servidor de Socket.IO utilizada por este módulo.
    * Asigna la instancia proporcionada a la referencia compartida io para habilitar
    * operaciones de sockets en toda la aplicación. Debe llamarse durante el arranque, antes de cualquier uso de sockets.
    @param instance - Servidor de Socket.IO que se registrará como la instancia compartida io.
    @returns void 
*/
export const setSocketInstance = (instance: IOServer) => {
  io = instance;
};

/**
 * Obtiene la instancia global de Socket.IO ya inicializada.
 *
 * Debe llamarse únicamente después de configurar la instancia mediante {@link setSocketInstance}.
 * Si no existe una instancia disponible, la función lanzará un error para evitar usos indebidos.
 *
 * Casos de uso típicos:
 * - Emitir eventos desde módulos que no tienen acceso directo al servidor HTTP.
 * - Suscribirse a namespaces o salas después de la inicialización.
 *
 * @returns {IOServer} Instancia compartida de Socket.IO.
 * @throws {Error} Si la instancia no ha sido inicializada con {@link setSocketInstance}.
 * @see setSocketInstance
 * @example
 * // Durante el arranque de la app:
 * // setSocketInstance(new IOServer(httpServer));
 * //
 * // En cualquier módulo:
 * const io = getSocketInstance();
 * io.emit("system:ready");
 */
export const getSocketInstance = (): IOServer => {
  if (!io) throw new Error("Socket.io instance not initialized");
  return io;
};
