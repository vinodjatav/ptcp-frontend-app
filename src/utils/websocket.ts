import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WEBSOCKET_URL = "http://localhost:8080/ws"; // Adjust if needed

export const createStompClient = () => {
  const socket = new SockJS(WEBSOCKET_URL);

  const stompClient = new Client({
    webSocketFactory: () => socket,
    debug: (str) => console.log(str),
    reconnectDelay: 5000, // Auto-reconnect
  });

  return stompClient;
};
