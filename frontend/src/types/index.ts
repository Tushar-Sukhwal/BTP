export interface Viewer {
  id: string;
  socketId: string;
  peerConnection: RTCPeerConnection;
}
