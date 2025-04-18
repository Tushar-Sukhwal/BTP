import React from 'react';

interface CameraSwitcherProps {
  localStream: MediaStream | null;
  isMobile: boolean;
  onStreamUpdate?: (stream: MediaStream) => void;
}

export const CameraSwitcher: React.FC<CameraSwitcherProps> = ({ 
  localStream, 
  isMobile,
  onStreamUpdate
}) => {
  const [facingMode, setFacingMode] = React.useState<'user' | 'environment'>('environment');
  
  // Only show on mobile devices
  if (!isMobile) return null;
  
  const switchCamera = async () => {
    if (!localStream) return;
    
    // Stop current video tracks
    localStream.getVideoTracks().forEach(track => track.stop());
    
    try {
      // Get new video stream with switched camera
      const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: newFacingMode,
        },
        audio: false, // Don't get audio again
      });
      
      // Replace video track
      const newVideoTrack = newStream.getVideoTracks()[0];
      const audioTrack = localStream.getAudioTracks()[0];
      
      // Create a new stream with the existing audio and new video
      const updatedStream = new MediaStream([newVideoTrack, audioTrack]);
      
      setFacingMode(newFacingMode);
      
      if (onStreamUpdate) {
        onStreamUpdate(updatedStream);
      }
      
      return updatedStream;
    } catch (error) {
      console.error('Error switching camera:', error);
      return null;
    }
  };
  
  return (
    <button 
      onClick={switchCamera}
      className="p-3 rounded-full bg-blue-500 hover:bg-blue-600"
    >
      <svg
        className="w-6 h-6 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    </button>
  );
};
