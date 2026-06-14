import { io } from 'socket.io-client';

const BACKEND_URL = 'http://localhost:3000'; 
class SocketService {
  socket = null;

  /**
   * Action: Establishes a singular, long-lived WebSocket line to the server gateway.
   * Ensures that multiple initialization requests return the exact same connection pipe.
   */
  connect() {
    if (this.socket) return this.socket;

    // Initialize the official Socket.io client configuration matrix
    this.socket = io(BACKEND_URL, {
      autoConnect: true,
      reconnection: true,     
      reconnectionAttempts: 10,   
      reconnectionDelay: 2000,    
    });

    // Global connection lifecycle observers for local debugging
    this.socket.on('connect', () => {
      console.log(`🔌 [Socket Engine] Connected to WebSocket Gateway. Active ID: ${this.socket.id}`);
    });

    this.socket.on('disconnect', (reason) => {
      console.warn(`❌ [Socket Engine] Real-time link dropped. Reason: ${reason}`);
    });

    return this.socket;
  }

  /**
   * Action: Explicitly severs the active TCP pipeline network link (highly useful during user logout profiles).
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new SocketService();