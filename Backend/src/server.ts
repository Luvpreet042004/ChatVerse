import express, { Request, Response, NextFunction } from "express";
import { Server,Socket } from "socket.io";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();
const app = express();
app.use(cors());
const server = http.createServer(app);

// Middleware
app.use(express.json());

// Log requests
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api", routes);

// Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL, // Allow your frontend domain
    methods: ["GET", "POST"],
    credentials: true,
  },
}); 

io.on("connection", (socket: Socket) => {
  console.log("User connected", socket.id);

  // Handle user joining a specific chat room
  socket.on("inchat", (sid: number, rid: number) => {
    const room = `chat_${Math.min(sid, rid)}_${Math.max(sid, rid)}`;
    socket.join(room);
    console.log(`User ${sid} joined room: ${room}`);
  });

  socket.on("updateConnection", (userId: number) => {
    // Broadcast an update event for the user's connections
    io.emit(`connectionsUpdated:${userId}`);
    console.log(`Connection updated for user ${userId}`);
  });

  // Listen for new messages and broadcast them to the appropriate room
  socket.on("sendMessage", async (message: { senderId: number; receiverId: number; content: string; timestamp: Date}) => {
    const { senderId, receiverId, content,timestamp } = message;

    // Compute the room name based on sender and receiver IDs
    const room = `chat_${Math.min(senderId, receiverId)}_${Math.max(senderId, receiverId)}`;

    try {
      // Save the message to the database
      await prisma.directMessage.create({
        data: {
          content,
          senderId: senderId,
          receiverId: receiverId,
          timestamp :timestamp,
          status: "sent",
        },
      });

      // Emit the message to all clients in the room
      io.to(room).emit("receiveMessage", message);
      console.log(`Message sent to room: ${room}`);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  // Handle user disconnecting
  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});


// Graceful Shutdown for Prisma and HTTP Server
process.on("SIGINT", async () => {
  console.log("Shutting down...");
  await prisma.$disconnect();
  server.close(() => {
    console.log("Server has been shut down.");
    process.exit(0);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  if (!process.env.CLIENT_URL) {
    console.warn("CLIENT_URL is not defined in the environment variables");
  }
});
