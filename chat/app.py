from flask import Flask, request, jsonify
from flask_cors import CORS
from chatbot import chatbot
from googletrans import Translator

app = Flask(__name__)
CORS(app)  # Allow all origins for development; restrict later for production

translator = Translator()

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data.get('message', '').strip()
        language = data.get('language', 'en')

        if not user_message:
            return jsonify({'response': 'Please enter a valid message.'}), 400

        # Get chatbot response
        bot_response = chatbot(user_message, language)

        print(f"User ({language}): {user_message}")
        print(f"Bot ({language}): {bot_response}")

        return jsonify({'response': bot_response})
    
    except Exception as e:
        print(f"❌ Error in /api/chat: {str(e)}")
        return jsonify({'response': f'Server error: {str(e)}'}), 500

@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({'status': '✅ API is working!'})

if __name__ == '__main__':
    print("🚀 Starting Flask server at http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)
