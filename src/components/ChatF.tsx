import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { Send, User } from "lucide-react";
import "../styles/Chat.css"; // ✅ Ensure this CSS file is linked

const socket = io("http://localhost:5000"); // ✅ Ensure backend is running

interface Message {
  id?: number;
  username: string;
  message: string;
  timestamp?: string;
}

const ChatF: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ✅ Load chat history & listen for new messages
  useEffect(() => {
    socket.on("chatHistory", (history: Message[]) => {
      setMessages(history);
    });

    socket.on("receiveMessage", (newMessage: Message) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.off("chatHistory");
      socket.off("receiveMessage");
    };
  }, []);

  // ✅ Scroll to the latest message smoothly
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Send message function
  const sendMessage = () => {
    const trimmedMessage = message.trim();
    const trimmedUsername = username.trim();

    if (trimmedMessage && trimmedUsername) {
      socket.emit("sendMessage", { username: trimmedUsername, message: trimmedMessage });
      setMessage(""); // Clear input after sending
    }
  };

  // ✅ Allow sending message with "Enter" key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <User className="chat-icon" />
        <h2>Community Chat</h2>
      </div>

      <div className="chat-box">
        {messages.map((msg) => (
          <div key={msg.id || msg.username + msg.timestamp} className={`chat-message ${msg.username === username ? "sent" : "received"}`}>
            <div className="message-content">
              <span className="message-text">{msg.message}</span>
              <span className="message-time">{new Date(msg.timestamp || "").toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          placeholder="Enter your name..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="username-input"
        />
        <div className="input-box">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress} // ✅ Send on Enter key press
          />
          <button onClick={sendMessage} className="send-button">
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatF;
