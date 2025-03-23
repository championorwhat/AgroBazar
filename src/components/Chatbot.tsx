import  { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, ChevronDown, ChevronUp } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I am KisanBot, your farming assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Mock bot response
    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: "I understand you're asking about farming. Once connected to an AI service, I'll provide detailed answers to help you with agricultural best practices.",
      sender: 'bot',
      timestamp: new Date(),
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed z-50 bottom-4 right-4 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors ${
          isOpen ? 'hidden' : 'flex'
        }`}
      >
        <MessageSquare className="h-6 w-6" />
      </button>

      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ease-in-out
            ${isMinimized
              ? 'bottom-4 right-4 w-72'
              : 'bottom-0 right-0 w-full sm:bottom-4 sm:right-4 sm:w-96'
            }
          `}
        >
          {/* Header */}
          <div className="bg-green-600 text-white p-3 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <h3 className="font-semibold">KisanBot Assistant</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMinimize}
                className="p-1 hover:bg-green-700 rounded"
              >
                {isMinimized ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-green-700 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Chat content */}
          {!isMinimized && (
            <>
              <div
                ref={chatContainerRef}
                className="bg-white h-[calc(100vh-12rem)] sm:h-96 overflow-y-auto p-4 space-y-4 shadow-inner"
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === 'user'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {message.text}
                      </p>
                      <span className="text-xs opacity-75 mt-1 block">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input form */}
              <form
                onSubmit={handleSend}
                className="bg-white p-3 rounded-b-lg border-t shadow-lg"
              >
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                  <button
                    type="submit"
                    className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors"
                    disabled={!input.trim()}
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
 