'use client';

import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { VideoPlayer } from '@/components/VideoPlayer';
import { HostControls } from '@/components/HostControls';
import { connectSocket, disconnectSocket } from '@/lib/socket';
import { initializeHost } from '@/lib/webrtc';
import { Viewer } from '@/types';
import { useMobileDetector } from '@/components/MobileDetector';

export default function HostPage() {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [roomId, setRoomId] = useState<string>('');
  const [userId] = useState<string>(uuidv4());
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [viewers, setViewers] = useState<Viewer[]>([]);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const isMobile = useMobileDetector();
  
  // Start streaming
  const startStream = async () => {
    try {
      // Get user media from camera and microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: isMobile ? 720 : 1280 },
          height: { ideal: isMobile ? 1280 : 720 },
          facingMode: isMobile ? 'environment' : 'user', // Use back camera on mobile by default
        },
        audio: true,
      });
      
      setLocalStream(stream);
      
      // Generate room ID if not already set
      const newRoomId = roomId || uuidv4().substring(0, 8);
      setRoomId(newRoomId);
      
      // Connect to signaling server
      const socket = connectSocket();
      
      // Register as host
      socket.emit('register-host', {
        userId,
        roomId: newRoomId,
      });
      
      // Listen for confirmation
      socket.once('host-registered', () => {
        setIsStreaming(true);
        // Initialize WebRTC for host
        initializeHost(socket, stream, setViewers);
      });
    } catch (error) {
      console.error('Error starting stream:', error);
    }
  };
  
  // Stop streaming
  const stopStream = () => {
    if (localStream) {
      // Stop all tracks
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    
    // Close all peer connections
    viewers.forEach(viewer => {
      viewer.peerConnection.close();
    });
    
    setViewers([]);
    setIsStreaming(false);
    disconnectSocket();
  };
  
  // Copy room link to clipboard
  const copyRoomLink = () => {
    const roomLink = `${window.location.origin}/viewer?roomId=${roomId}`;
    navigator.clipboard.writeText(roomLink)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
      });
  };
  
  // Update stream when camera is switched
  const handleStreamUpdate = (newStream: MediaStream) => {
    setLocalStream(newStream);
    
    // Update all peer connections with the new stream
    viewers.forEach(viewer => {
      const senders = viewer.peerConnection.getSenders();
      const videoSender = senders.find(sender => 
        sender.track?.kind === 'video'
      );
      
      if (videoSender && newStream.getVideoTracks().length > 0) {
        videoSender.replaceTrack(newStream.getVideoTracks()[0]);
      }
    });
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopStream();
    };
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6">Host Live Stream</h1>
      
      {isStreaming ? (
        <>
          <div className="w-full max-w-3xl mb-4">
            <VideoPlayer stream={localStream} muted={true} className="border-4 border-blue-500" />
          </div>
          
          <HostControls 
            localStream={localStream} 
            isMobile={isMobile}
            onStreamUpdate={handleStreamUpdate}
          />
          
          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg w-full max-w-3xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Room ID: {roomId}</h2>
              <button
                onClick={copyRoomLink}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                {isCopied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
            
            <div className="mb-4">
              <h3 className="font-medium mb-2">Active Viewers: {viewers.length}</h3>
              {viewers.length > 0 ? (
                <ul className="list-disc pl-5">
                  {viewers.map(viewer => (
                    <li key={viewer.socketId}>Viewer {viewer.id.substring(0, 6)}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No viewers yet.</p>
              )}
            </div>
            
            <button
              onClick={stopStream}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
            >
              Stop Streaming
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center max-w-md mx-auto p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
          <p className="mb-6 text-center">
            Start live streaming from your device&apos;s camera. You&apos;ll get a link to share with viewers.
          </p>
          
          <button
            onClick={startStream}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-medium"
          >
            Start Streaming
          </button>
        </div>
      )}
    </div>
  );
}
