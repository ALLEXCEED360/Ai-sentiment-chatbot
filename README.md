# 🤖 AI Sentiment Analysis Chatbot

A modern, vibrant sentiment analysis chatbot that analyzes your emotions in real-time using AI. Built with React frontend and Flask backend, featuring a stunning glassmorphism UI with animated gradients.

![Sentiment Analyzer Demo](https://img.shields.io/badge/Status-Working-brightgreen)
![React](https://img.shields.io/badge/React-18+-blue)
![Flask](https://img.shields.io/badge/Flask-2.0+-red)
![Python](https://img.shields.io/badge/Python-3.8+-yellow)

## ✨ Features

- 🎯 **Real-time Sentiment Analysis** - Instantly analyzes your mood and emotions
- 📊 **Detailed Scoring** - Shows polarity and subjectivity scores with explanations
- 🎨 **Vibrant UI** - Beautiful glassmorphism design with animated gradients
- 🌈 **Color-coded Responses** - Different colors for positive, negative, and neutral sentiments
- 💫 **Smooth Animations** - Engaging hover effects and transitions
- 📱 **Responsive Design** - Works perfectly on all devices
- ⚡ **Fast Processing** - Powered by TextBlob for quick sentiment detection

## 🛠️ Tech Stack

### Frontend
- **React 18+** - Modern UI framework
- **Material-UI (MUI)** - Component library
- **Axios** - HTTP client for API calls
- **CSS3** - Custom animations and glassmorphism effects

### Backend
- **Flask** - Python web framework
- **TextBlob** - Natural language processing for sentiment analysis
- **Flask-CORS** - Cross-origin resource sharing
- **Python 3.8+** - Backend programming language

## 🚀 Quick Start

### Prerequisites
- **Node.js** (version 14 or higher)
- **Python** (version 3.8 or higher)
- **npm** or **yarn**

### 📥 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-sentiment-chatbot.git
   cd ai-sentiment-chatbot
   ```

2. **Set up the Backend (Flask)**
   ```bash
   # Install Python dependencies
   pip install flask flask-cors textblob

   # Download TextBlob corpora (required for sentiment analysis)
   python -m textblob.download_corpora
   
   # Start the Flask server
   python app.py
   ```
   The backend will run on `http://localhost:5000`

3. **Set up the Frontend (React)**
   ```bash
   # Navigate to frontend directory
   cd frontend
   
   # Install dependencies
   npm install
   
   # Start the React development server
   npm start
   ```
   The frontend will run on `http://localhost:3000`

## 💡 How to Use

1. **Start both servers** (Backend on port 5000, Frontend on port 3000)
2. **Open your browser** and go to `http://localhost:3000`
3. **Type any message** expressing your thoughts or emotions
4. **Watch the magic happen** - the bot will analyze your sentiment and show:
   - Your current mood (POSITIVE/NEGATIVE/NEUTRAL)
   - Polarity score (-1.0 to 1.0)
   - Subjectivity score (0.0 to 1.0)
   - Visual color-coding and animations

## 📁 Project Structure

```
ai-sentiment-chatbot/
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── App.js          # Main React component
│   │   ├── App.css         # Vibrant styling and animations
│   │   ├── App.test.js     # Unit tests
│   │   ├── index.js        # React entry point
│   │   ├── index.css       # Global styles
│   │   ├── reportWebVitals.js
│   │   └── setupTests.js
│   ├── package.json        # Frontend dependencies
│   └── public/
├── app.py                  # Flask backend server
├── chatbot.py             # Sentiment analysis logic
├── requirements.txt       # Python dependencies
├── README.md              # Project documentation
└── LICENSE               # MIT License
```

## 🎨 UI Showcase

### Design Features
- **🌈 Animated Background** - Continuous gradient color shifting
- **💎 Glassmorphism Effects** - Frosted glass design with blur effects
- **🎭 Sentiment Color Coding**:
  - 💚 Positive: Green gradients
  - ❤️ Negative: Red-orange gradients  
  - 💙 Neutral: Blue gradients
- **✨ Micro-interactions** - Hover effects, button animations, and smooth transitions

## 🧠 How It Works

The sentiment analysis uses **TextBlob**, a Python library that processes natural language to determine:

1. **Polarity** (-1.0 to 1.0): How positive or negative the text is
2. **Subjectivity** (0.0 to 1.0): How opinion-based vs factual the text is

The algorithm categorizes messages as:
- **Positive**: Polarity > 0.1
- **Negative**: Polarity < -0.1  
- **Neutral**: Polarity between -0.1 and 0.1

## 🧪 Testing

Run the frontend tests:
```bash
cd frontend
npm test
```

The test suite includes:
- Component rendering tests
- User interaction tests
- API integration tests
- Error handling tests

## 🚀 Deployment Options

### Frontend Deployment
- **Netlify** - Connect your GitHub repo for automatic deploys
- **Vercel** - Zero-config deployments for React apps
- **GitHub Pages** - Free hosting for static sites

### Backend Deployment
- **Heroku** - Easy Python app deployment
- **Railway** - Modern hosting platform
- **PythonAnywhere** - Python-focused hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **TextBlob** - For powerful sentiment analysis capabilities
- **Material-UI** - For beautiful React components
- **Flask** - For the lightweight backend framework
- **React Community** - For the amazing ecosystem

## 📞 Support

If you have any questions or run into issues:
- 🐛 **Report bugs** by opening an issue
- 💡 **Suggest features** via GitHub discussions
- ⭐ **Star the repo** if you find it helpful!

---

**Made with ❤️ and lots of ☕**

[![GitHub stars](https://img.shields.io/github/stars/yourusername/ai-sentiment-chatbot.svg?style=social&label=Star)](https://github.com/yourusername/ai-sentiment-chatbot)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/ai-sentiment-chatbot.svg?style=social&label=Fork)](https://github.com/yourusername/ai-sentiment-chatbot/fork)
