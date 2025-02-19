import React, { useEffect, useState, useRef } from "react";
import { createStompClient } from "../../utils/websocket";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import dayjs from "dayjs";
import { Message, User } from "../../models/Models";
import { useAuth } from "../../store/AuthContext";
import axiosClient from "../../utils/axiosClient";

const Chat: React.FC = () => {
    const { userId } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const stompClientRef = useRef<any>(null);
  const senderId = 7; // Parent ID (Change as needed)
  const receiverId = 6; // Teacher ID

  // Fetch chat history from backend
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axiosClient.get<Message[]>(`/api/chat/${userId}/${receiverId}`);
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };
    

    fetchChatHistory(); // Call the function when the component mounts

    const stompClient = createStompClient();
    stompClient.onConnect = () => {
      console.log("Connected to WebSocket");

      stompClient.subscribe("/topic/messages", (message) => {
        const receivedMessage: Message = JSON.parse(message.body);
        setMessages((prev) => [...prev, receivedMessage]);
      });
    };

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [userId]);

  const sendMessage = () => {
    if (messageInput.trim() === "" || !stompClientRef.current) return;

    const sender: User = {
      id: userId || senderId,
      username: "temp-parent",
      password: "abcd",
      role: "ROLE_PARENT",
    };

    const receiver: User = {
      id: receiverId,
      username: "temp-teacher",
      password: "abcd",
      role: "ROLE_TEACHER",
    };
    const newMessage: Message = {
      sender: sender,
      receiver: receiver,
      message: messageInput,
      timestamp: new Date().toISOString(),
    };

    stompClientRef.current.publish({
      destination: "/app/chat",
      body: JSON.stringify(newMessage),
    });

    setMessageInput("");
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Parent-Teacher Chat
      </Typography>
      <Paper sx={{ p: 2, maxHeight: 400, overflowY: "auto" }}>
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems:
                msg.sender.id === senderId ? "flex-end" : "flex-start",
              mb: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                backgroundColor:
                  msg.sender.id === senderId ? "#1976d2" : "#e0e0e0",
                color: msg.sender.id === senderId ? "#fff" : "#000",
                borderRadius: "8px",
                p: 1,
                maxWidth: "80%",
              }}
            >
              {msg.message}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {dayjs(msg.timestamp).format("HH:mm")}
            </Typography>
          </Box>
        ))}
      </Paper>

      <Box sx={{ display: "flex", mt: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <Button
          onClick={sendMessage}
          variant="contained"
          color="primary"
          sx={{ ml: 1 }}
        >
          <SendIcon />
        </Button>
      </Box>
    </Box>
  );
};

export default Chat;
