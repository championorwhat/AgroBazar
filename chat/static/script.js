document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const micButton = document.getElementById('mic-button');
    const languageSelect = document.getElementById('language-select');
    const synth = window.speechSynthesis;
    let isVoiceInput = false; // Track if voice input was used

    micButton.style.width = '50px'; // Increase mic button size
    micButton.style.height = '50px';

    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = message;
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typing-indicator';
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            typingDiv.appendChild(dot);
        }
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) typingIndicator.remove();
    }

    async function sendMessage(message) {
        try {
            showTypingIndicator();
            const selectedLanguage = languageSelect.value || "en";
            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ message: message, language: selectedLanguage })
            });
            if (!response.ok) throw new Error(`Server error: ${response.status}`);
            const data = await response.json();
            removeTypingIndicator();
            addMessage(data.response, false);
            if (isVoiceInput) {
                speakResponse(data.response);
                isVoiceInput = false; // Reset after speaking
            }
        } catch (error) {
            console.error('Error:', error);
            removeTypingIndicator();
            addMessage('Sorry, I encountered an error. Please try again later.', false);
        }
    }

    function speakResponse(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            synth.speak(utterance);
        }
    }

    async function testApiConnection() {
        try {
            const response = await fetch('http://localhost:5000/api/test');
            const data = await response.json();
            console.log('API Test:', data);
            return data.status === 'API is working!';
        } catch (error) {
            console.error('API Test Error:', error);
            return false;
        }
    }

    testApiConnection().then(isConnected => {
        if (!isConnected) {
            addMessage('Warning: Could not connect to the chatbot backend. Make sure the server is running on port 5000.', false);
        }
    });

    sendButton.addEventListener('click', () => {
        const message = userInput.value.trim();
        if (message) {
            addMessage(message, true);
            userInput.value = '';
            sendMessage(message);
        }
    });

    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const message = userInput.value.trim();
            if (message) {
                addMessage(message, true);
                userInput.value = '';
                sendMessage(message);
            }
        }
    });

    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        micButton.addEventListener('click', () => {
            isVoiceInput = true; // Mark as voice input
            recognition.start();
        });

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            userInput.value = transcript;
            addMessage(transcript, true);
            sendMessage(transcript);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
        };
    } else {
        console.warn('Speech recognition not supported in this browser.');
    }
});
