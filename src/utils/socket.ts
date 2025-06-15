import { Server } from "http";
import { Server as SocketIOServer } from "socket.io";

// Track connected clients
const clients: Map<string, string> = new Map();

let io: SocketIOServer;

export const setupSocketIO = (server: Server) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: "*", // Replace with your frontend origin in production
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Client sends their user ID
    socket.on("identify", (userId: string) => {
      clients.set(userId, socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
      for (const [userId, sockId] of clients.entries()) {
        if (sockId === socket.id) {
          clients.delete(userId);
          break;
        }
      }
    });
  });
};

// Export for use in event listeners
export { io, clients };
