import React, { useRef, useEffect } from "react";

interface VideoPlayerProps {
  stream: MediaStream | null;
  muted?: boolean;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  stream,
  muted = false,
  className = "",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;

      // Ensure video plays
      const playVideo = async () => {
        try {
          await videoRef.current?.play();
          console.log("Video playing successfully");
        } catch (err) {
          console.error("Error playing video:", err);
        }
      };

      playVideo();
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted={muted}
      controls={false}
      className={`w-full h-auto rounded-lg ${className}`}
    />
  );
};
