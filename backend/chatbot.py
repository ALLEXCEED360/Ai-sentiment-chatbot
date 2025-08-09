from textblob import TextBlob

def analyze_sentiment(text):
    analysis = TextBlob(text)
    polarity = analysis.sentiment.polarity
    subjectivity = analysis.sentiment.subjectivity
    
    if polarity > 0.1:
        sentiment = "positive"
    elif polarity < -0.1:
        sentiment = "negative"
    else:
        sentiment = "neutral"
    
    return sentiment, polarity, subjectivity

def get_bot_response(user_text):
    """Return sentiment analysis results in a simple format"""
    if not user_text.strip():
        return "Please enter a message to analyze.", "neutral"
    
    sentiment, polarity, subjectivity = analyze_sentiment(user_text)
    
    # Format the response with mood and scores
    response = f"""Your mood: {sentiment.upper()}

Sentiment Scores:
• Polarity: {polarity:.3f} (range: -1.0 to 1.0)
• Subjectivity: {subjectivity:.3f} (range: 0.0 to 1.0)

Explanation:
• Polarity measures how positive/negative your message is
• Subjectivity measures how opinion-based vs factual your message is"""
    
    return response, sentiment