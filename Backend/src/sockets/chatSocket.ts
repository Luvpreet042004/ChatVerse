import { Server, Socket } from "socket.io";

interface User {
  userId: string;
  socketId: string;
}

const users: User[] = [];

export const registerChatSocket = (io: Server, socket: Socket) => {
  // Add user to active list
  socket.on("user:join", (userId: string) => {
    users.push({ userId, socketId: socket.id });
    io.emit("active-users", users); // Notify all clients
  });

  // Handle joining a room
  socket.on("room:join", (roomId: string) => {
    socket.join(roomId);
    socket.to(roomId).emit("room:message", `User ${socket.id} joined the room.`);
  });

  // Handle leaving a room
  socket.on("room:leave", (roomId: string) => {
    socket.leave(roomId);
    socket.to(roomId).emit("room:message", `User ${socket.id} left the room.`);
  });

  // Handle sending messages in a room
  socket.on("room:message", ({ roomId, message }) => {
    io.to(roomId).emit("room:message", { userId: socket.id, message });
  });

  // Handle 1-to-1 chat
  socket.on("private:message", ({ recipientId, message }) => {
    const recipient = users.find((user) => user.userId === recipientId);
    if (recipient) {
      io.to(recipient.socketId).emit("private:message", {
        userId: socket.id,
        message,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  
    // Remove user from the active users list
    const index = users.findIndex((user) => user.socketId === socket.id);
    if (index !== -1) {
      users.splice(index, 1); // Remove user
      io.emit("active-users", users); // Notify all clients of the updated list
    }
  });
  
};
