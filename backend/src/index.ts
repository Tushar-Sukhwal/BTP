import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { UserConnection } from "./types";
import uploadRoutes from "./routes/uploadRoutes";
import compressionRoutes from "./routes/compressionRoutes";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors(
  {
    origin: "*",
    methods: ["GET", "POST"],
  }
));

const PORT = process.env.PORT || 9000;

// Store active connections
const connections: Record<string, UserConnection> = {};
const rooms: Record<string, string[]> = {}; // roomId -> socketIds

io.on("connection", (socket) => {
  console.log(`New connection: ${socket.id}`);

  // Handle host registration
  socket.on("register-host", ({ userId, roomId }) => {
    console.log(`Host registered: ${userId} in room ${roomId}`);

    connections[socket.id] = {
      userId,
      socketId: socket.id,
      isHost: true,
      roomId,
    };

    // Create room if it doesn't exist
    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }

    // Add host to room
    rooms[roomId].push(socket.id);

    // Join socket room
    socket.join(roomId);

    // Confirm registration
    socket.emit("host-registered", { roomId });
  });

  // Handle viewer joining
  socket.on("join-room", ({ userId, roomId }) => {
    console.log(`Viewer ${userId} joining room ${roomId}`);

    connections[socket.id] = {
      userId,
      socketId: socket.id,
      isHost: false,
      roomId,
    };

    // Check if room exists
    if (!rooms[roomId]) {
      socket.emit("room-not-found");
      return;
    }

    // Add viewer to room
    rooms[roomId].push(socket.id);

    // Join socket room
    socket.join(roomId);

    // Notify host about new viewer
    const hostSocketId = rooms[roomId].find((id) => connections[id]?.isHost);
    if (hostSocketId) {
      io.to(hostSocketId).emit("viewer-joined", {
        viewerId: userId,
        viewerSocketId: socket.id,
      });
    }

    // Confirm join
    socket.emit("joined-room", { roomId });
  });

  // WebRTC signaling

  // Handle offer from host to viewer
  socket.on("offer", ({ offer, targetSocketId }) => {
    console.log(`Received offer for ${targetSocketId}`);
    io.to(targetSocketId).emit("offer", {
      offer,
      from: socket.id,
    });
  });

  // Handle answer from viewer to host
  const processedMessages = new Set();

  socket.on("answer", ({ answer, targetSocketId, messageId }) => {
    // Skip if we've already processed this message
    if (processedMessages.has(messageId)) return;
    processedMessages.add(messageId);

    console.log(`Received answer for ${targetSocketId}`);
    io.to(targetSocketId).emit("answer", {
      answer,
      from: socket.id,
    });

    // Clean up old message IDs periodically
    if (processedMessages.size > 1000) {
      const oldestMessages = [...processedMessages].slice(0, 500);
      oldestMessages.forEach((id) => processedMessages.delete(id));
    }
  });
  // Handle ICE candidates
  socket.on("ice-candidate", ({ candidate, targetSocketId }) => {
    console.log(`Received ICE candidate for ${targetSocketId}`);
    io.to(targetSocketId).emit("ice-candidate", {
      candidate,
      from: socket.id,
    });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`Disconnected: ${socket.id}`);

    const connection = connections[socket.id];
    if (connection) {
      const { roomId, isHost, userId } = connection;

      // Remove from connections
      delete connections[socket.id];

      if (roomId && rooms[roomId]) {
        // Remove from room
        rooms[roomId] = rooms[roomId].filter((id) => id !== socket.id);

        // If host disconnects, notify all viewers
        if (isHost) {
          io.to(roomId).emit("host-disconnected");
          // Clean up room
          delete rooms[roomId];
        } else {
          // If viewer disconnects, notify host
          const hostSocketId = rooms[roomId].find(
            (id) => connections[id]?.isHost
          );
          if (hostSocketId) {
            io.to(hostSocketId).emit("viewer-disconnected", {
              viewerId: userId,
              viewerSocketId: socket.id,
            });
          }
        }
      }
    }
  });
});

// get request for root
app.get("/", (req, res) => {
  res.send("WebRTC Signaling Server");
});

app.use("/api/upload", uploadRoutes);
app.use("/compression", compressionRoutes);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
