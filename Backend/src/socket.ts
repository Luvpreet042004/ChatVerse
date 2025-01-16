// // socket.ts
// import { Server, Socket } from "socket.io";
// import { PrismaClient } from "@prisma/client";
// import { server } from './server'; // Import the server instance

// const prisma = new PrismaClient();

// const io = new Server(server, {
//   cors: {
//     origin: process.env.CLIENT_URL || "http://localhost:5173", // Allow your frontend domain
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// io.on("connection", (socket: Socket) => {
//   console.log("User connected", socket.id);

//   // Join rooms for direct messaging
//   socket.on("inchat", (sid: number, rid: number) => {
//     socket.join(`chat_${Math.min(sid, rid)}_${Math.max(sid, rid)}`);
//     console.log(`User ${sid} joined their room chat_${Math.min(sid, rid)}_${Math.max(sid, rid)}`);
//   });

//   socket.on("updateConnection", (userId: number) => {
//     // Emit an event to the client
//     io.emit(`connectionsUpdated:${userId}`);
//   });

//   // Listen for new messages
//   socket.on("sendMessage", async (message: { senderId: string; receiverId: string; content: string }) => {
//     const { senderId, receiverId, content } = message;

//     try {
//       // Save message to database
//       await prisma.directMessage.create({
//         data: {
//           content,
//           senderId: Number(senderId),
//           receiverId: Number(receiverId),
//           status: "sent",
//         },
//       });

//       // Emit message to the receiver
//       if (io.sockets.adapter.rooms.has(receiverId)) {
//         io.to(receiverId).emit("receiveMessage", message);
//       } else {
//         console.log(`Receiver ${receiverId} is not connected`);
//       }
//     } catch (error) {
//       console.error("Error saving message:", error);
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected", socket.id);
//   });
// });

// // Export the io instance
// export { io };
