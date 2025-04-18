import { Socket } from "socket.io-client";
import { Viewer } from "@/types";

// ICE servers for STUN/TURN
const iceServers = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
  ],
};

// Configuration for peer connections
export const peerConfig: RTCConfiguration = {
  ...iceServers,
  iceCandidatePoolSize: 10,
};

// Host functions
export async function createPeerConnectionForViewer(
  socket: Socket,
  viewerSocketId: string,
  localStream: MediaStream
): Promise<RTCPeerConnection> {
  const peerConnection = new RTCPeerConnection(peerConfig);

  // Add all tracks from local stream to peer connection
  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  // Handle ICE candidates
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("ice-candidate", {
        candidate: event.candidate,
        targetSocketId: viewerSocketId,
      });
    }
  };

  // Create and send offer
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  socket.emit("offer", {
    offer,
    targetSocketId: viewerSocketId,
  });

  return peerConnection;
}

// Initialize host by setting up listeners
export function initializeHost(
  socket: Socket,
  localStream: MediaStream,
  setViewers: React.Dispatch<React.SetStateAction<Viewer[]>>
) {
  // Handle viewer joining
  socket.on("viewer-joined", async ({ viewerId, viewerSocketId }) => {
    console.log(`Viewer joined: ${viewerId} (${viewerSocketId})`);

    const peerConnection = await createPeerConnectionForViewer(
      socket,
      viewerSocketId,
      localStream
    );

    setViewers((prev) => [
      ...prev,
      {
        id: viewerId,
        socketId: viewerSocketId,
        peerConnection,
      },
    ]);
  });

  // Handle viewer disconnecting
  socket.on("viewer-disconnected", ({ viewerSocketId }) => {
    console.log(`Viewer disconnected: ${viewerSocketId}`);

    setViewers((prev) => {
      const viewer = prev.find((v) => v.socketId === viewerSocketId);
      if (viewer) {
        viewer.peerConnection.close();
      }
      return prev.filter((v) => v.socketId !== viewerSocketId);
    });
  });

  // Handle answer from viewer
  socket.on("answer", async ({ answer, from }) => {
    console.log(`Received answer from ${from}`);

    setViewers((prev) => {
      const viewer = prev.find((v) => v.socketId === from);
      if (viewer) {
        // Only set remote description if we're in the correct state
        const signalingState = viewer.peerConnection.signalingState;
        console.log(`Current signaling state: ${signalingState}`);

        if (signalingState === "have-local-offer") {
          viewer.peerConnection
            .setRemoteDescription(new RTCSessionDescription(answer))
            .catch((err) =>
              console.error("Error setting remote description:", err)
            );
        } else {
          console.warn(`Cannot set remote answer in state: ${signalingState}`);
        }
      }
      return prev;
    });
  });

  // Handle ICE candidate from viewer
  socket.on("ice-candidate", ({ candidate, from }) => {
    console.log(`Received ICE candidate from ${from}`);

    setViewers((prev) => {
      const viewer = prev.find((v) => v.socketId === from);
      if (viewer) {
        viewer.peerConnection
          .addIceCandidate(new RTCIceCandidate(candidate))
          .catch((err) => console.error("Error adding ICE candidate:", err));
      }
      return prev;
    });
  });
}

// Viewer functions
export async function initializeViewer(
  socket: Socket,
  setRemoteStream: React.Dispatch<React.SetStateAction<MediaStream | null>>
) {
  const peerConnection = new RTCPeerConnection(peerConfig);

  // Set up remote stream handler
  peerConnection.ontrack = (event) => {
    console.log("Received remote track", event);

    if (event.streams && event.streams[0]) {
      console.log("Setting remote stream from ontrack event");
      setRemoteStream(event.streams[0]);

      // Additional logging to debug
      event.streams[0].getTracks().forEach((track) => {
        console.log(
          `Track added: ${track.kind}, enabled: ${track.enabled}, readyState: ${track.readyState}`
        );
      });
    } else {
      console.warn("Received track event without stream");
    }
  };

  // Handle ICE candidates
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("ice-candidate", {
        candidate: event.candidate,
        targetSocketId: socket.id, // Will be replaced by host's socketId
      });
    }
  };

  // Handle offer from host
  socket.on("offer", async ({ offer, from }) => {
    console.log(`Received offer from ${from}`);

    // Set remote description (offer from host)
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    // Create answer
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    // Send answer to host
    socket.emit("answer", {
      answer,
      targetSocketId: from,
    });
  });

  // Handle ICE candidate from host
  socket.on("ice-candidate", ({ candidate, from }) => {
    console.log(`Received ICE candidate from ${from}`);
    peerConnection
      .addIceCandidate(new RTCIceCandidate(candidate))
      .catch((err) => console.error("Error adding ICE candidate:", err));
  });

  // Handle host disconnection
  socket.on("host-disconnected", () => {
    console.log("Host disconnected");
    peerConnection.close();
    setRemoteStream(null);
  });

  return peerConnection;
}
