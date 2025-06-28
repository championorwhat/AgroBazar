import React, { useEffect, useRef, useState } from 'react';
import { Bot, X, Send, Mic } from 'lucide-react';
import axios from 'axios';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  // Setup voice recognition
  const startListening = () => {
    if (!SpeechRecognition) return alert('Speech Recognition not supported');

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      sendMessage(transcript);
    };

    recognition.onend = () => setListening(false);

    recognition.onerror = () => {
      setListening(false);
      alert('Voice input error.');
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    window.speechSynthesis.cancel(); // stop previous speech
    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = async (textOverride?: string) => {
    const finalText = (textOverride ?? input).trim();
    if (!finalText) return;

    setMessages(prev => [...prev, { text: finalText, sender: 'user' }]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/chat', {
        message: finalText,
        language: language,
      });

      const botReply = res.data.response;
      setMessages(prev => [...prev, { text: botReply, sender: 'bot' }]);
      speak(botReply); // Speak the bot reply
    } catch {
      const errMsg = '⚠️ Error connecting to chatbot.';
      setMessages(prev => [...prev, { text: errMsg, sender: 'bot' }]);
      speak(errMsg);
    }

    setLoading(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    stopListening();
    window.speechSynthesis.cancel();
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-all"
        >
          <Bot />
        </button>
      ) : (
        <div className="bg-white w-96 h-[32rem] rounded-xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-green-600 text-white p-3 flex justify-between items-center">
            <span className="font-semibold text-lg">AgroBot</span>
            <button onClick={handleClose}>
              <X />
            </button>
          </div>

          {/* Language Selection */}
          <div className="px-3 py-2">
            <select
              className="w-full px-2 py-1 border border-gray-300 rounded"
              value={language}
              onChange={e => setLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="ta">Tamil</option>
              <option value="bn">Bengali</option>
              <option value="te">Telugu</option>
              <option value="kn">Kannada</option>
            </select>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-3 overflow-y-auto bg-gray-50 space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[75%] px-3 py-2 rounded-lg ${
                  msg.sender === 'user'
                    ? 'ml-auto bg-green-100 text-right'
                    : 'mr-auto bg-gray-200 text-left'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="text-sm text-gray-500 italic">Typing...</div>
            )}
          </div>

          {/* Input Area */}
          <div className="flex items-center gap-2 border-t p-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none"
              placeholder="Type your message..."
            />
            <button
              onClick={sendMessage}
              className="bg-green-600 p-2 rounded-full text-white hover:bg-green-700"
            >
              <Send size={18} />
            </button>
            <button
              onClick={listening ? stopListening : startListening}
              className={`p-2 rounded-full ${
                listening ? 'bg-red-500' : 'bg-green-600'
              } text-white`}
            >
              <Mic size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;

