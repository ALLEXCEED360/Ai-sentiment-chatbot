from flask import Flask, request, jsonify
from chatbot import get_bot_response
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_text = data.get('message', '')
    reply, sentiment = get_bot_response(user_text)
    return jsonify({'reply': reply, 'sentiment': sentiment})

if __name__ == '__main__':
    app.run(debug=True)
