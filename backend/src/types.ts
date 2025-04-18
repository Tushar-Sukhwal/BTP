export interface UserConnection {
  userId: string;
  socketId: string;
  isHost: boolean;
  roomId?: string;
}
