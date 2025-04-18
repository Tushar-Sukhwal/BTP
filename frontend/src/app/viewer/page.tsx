"use client";

import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useSearchParams } from "next/navigation";
import { VideoPlayer } from "@/components/VideoPlayer";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { initializeViewer } from "@/lib/webrtc";

export default function ViewerPage() {
  const searchParams = useSearchParams();
  const [roomId, setRoomId] = useState<string>(
    searchParams?.get("roomId") || ""
  );
  const [userId] = useState<string>(uuidv4());
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Join streaming room
  const joinRoom = async () => {
    if (!roomId) {
      setError("Please enter a Room ID");
      return;
    }

    try {
      // Connect to signaling server
      const socket = connectSocket();

      // Initialize WebRTC for viewer
      await initializeViewer(socket, setRemoteStream);

      // Join room
      socket.emit("join-room", {
        userId,
        roomId,
      });

      // Listen for confirmation
      socket.once("joined-room", () => {
        setIsConnected(true);
        setError("");
      });

      // Listen for room not found
      socket.once("room-not-found", () => {
        setError("Room not found or host is not streaming");
        disconnectSocket();
      });

      // Listen for host disconnection
      socket.on("host-disconnected", () => {
        setIsConnected(false);
        setRemoteStream(null);
        setError("Host has ended the stream");
        disconnectSocket();
      });
    } catch (error) {
      console.error("Error joining room:", error);
      setError("Failed to join room");
    }
  };

  // Leave streaming room
  const leaveRoom = () => {
    setIsConnected(false);
    setRemoteStream(null);
    disconnectSocket();
  };

  // Auto-join if room ID is provided in URL
  useEffect(() => {
    if (roomId && !isConnected) {
      joinRoom();
    }

    return () => {
      leaveRoom();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6">Watch Live Stream</h1>

      {isConnected ? (
        <div className="w-full max-w-3xl">
          {remoteStream ? (
            <div className="mb-6">
              <VideoPlayer
                stream={remoteStream}
                className="border-4 border-green-500"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg mb-6">
              <p className="text-xl">Connecting to stream...</p>
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={leaveRoom}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded"
            >
              Leave Stream
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-md w-full p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="roomId" className="block text-sm font-medium mb-1">
              Room ID
            </label>
            <input
              type="text"
              id="roomId"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
              placeholder="Enter Room ID"
            />
          </div>

          <button
            onClick={joinRoom}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
          >
            Join Stream
          </button>
        </div>
      )}
    </div>
  );
}
