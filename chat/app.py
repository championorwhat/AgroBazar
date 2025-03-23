from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from googletrans import Translator  # For language translation

# Import your chatbot function
from chatbot import chatbot

app = Flask(__name__, static_folder='.')
CORS(app, resources={r"/api/*": {"origins": "*"}})  # More specific CORS configuration
translator = Translator()

@app.route('/')
def index():
    return send_from_directory('.', r'C:\Users\aritra basak\OneDrive\Desktop\farmer_final\chat\static\index.html')

@app.route('/styles.css')
def styles():
    return send_from_directory('.', 'styles.css')

@app.route('/script.js')
def script():
    return send_from_directory('.', 'script.js')

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message', '')
        language = data.get('language', 'en')  # Default to English if not provided

        if not user_message:
            return jsonify({'response': 'Please send a message.'}), 400

        # Get chatbot response
        bot_response = chatbot(user_message)

        # Translate bot response to selected language
        translated_response = translator.translate(bot_response, dest=language).text

        # Debug print
        print(f"User ({language}): {user_message}")
        print(f"Bot ({language}): {translated_response}")

        return jsonify({'response': translated_response})
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        return jsonify({'response': f'Server error: {str(e)}'}), 500

@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({'status': 'API is working!'})

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(debug=True, host='0.0.0.0', port=5000)