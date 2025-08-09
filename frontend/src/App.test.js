import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

describe('Chatbot App', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockedAxios.post.mockClear();
  });

  test('renders initial bot message', () => {
    render(<App />);
    const initialMessage = screen.getByText(/Hi! How can I help you today?/i);
    expect(initialMessage).toBeInTheDocument();
  });

  test('renders text input and send button', () => {
    render(<App />);
    const textInput = screen.getByPlaceholderText(/Type a message.../i);
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    expect(textInput).toBeInTheDocument();
    expect(sendButton).toBeInTheDocument();
  });

  test('sends message when send button is clicked', async () => {
    // Mock successful API response
    mockedAxios.post.mockResolvedValueOnce({
      data: { reply: 'Test bot response', sentiment: 'positive' }
    });

    render(<App />);
    const textInput = screen.getByPlaceholderText(/Type a message.../i);
    const sendButton = screen.getByRole('button', { name: /send/i });

    // Type a message and send it
    fireEvent.change(textInput, { target: { value: 'Hello bot!' } });
    fireEvent.click(sendButton);

    // Check that user message appears
    expect(screen.getByText('Hello bot!')).toBeInTheDocument();

    // Wait for bot response
    await waitFor(() => {
      expect(screen.getByText('Test bot response')).toBeInTheDocument();
    });

    // Verify API was called
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:5000/chat',
      { message: 'Hello bot!' }
    );
  });

  test('sends message when Enter key is pressed', async () => {
    // Mock successful API response
    mockedAxios.post.mockResolvedValueOnce({
      data: { reply: 'Enter key response', sentiment: 'neutral' }
    });

    render(<App />);
    const textInput = screen.getByPlaceholderText(/Type a message.../i);

    // Type a message and press Enter
    fireEvent.change(textInput, { target: { value: 'Testing Enter key' } });
    fireEvent.keyDown(textInput, { key: 'Enter' });

    // Check that user message appears
    expect(screen.getByText('Testing Enter key')).toBeInTheDocument();

    // Wait for bot response
    await waitFor(() => {
      expect(screen.getByText('Enter key response')).toBeInTheDocument();
    });
  });

  test('handles API error gracefully', async () => {
    // Mock API error
    mockedAxios.post.mockRejectedValueOnce(new Error('Network error'));

    render(<App />);
    const textInput = screen.getByPlaceholderText(/Type a message.../i);
    const sendButton = screen.getByRole('button', { name: /send/i });

    // Send a message
    fireEvent.change(textInput, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Oops, something went wrong!')).toBeInTheDocument();
    });
  });

  test('clears input after sending message', async () => {
    // Mock successful API response
    mockedAxios.post.mockResolvedValueOnce({
      data: { reply: 'Response', sentiment: 'neutral' }
    });

    render(<App />);
    const textInput = screen.getByPlaceholderText(/Type a message.../i);
    const sendButton = screen.getByRole('button', { name: /send/i });

    // Type and send message
    fireEvent.change(textInput, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    // Check that input is cleared
    expect(textInput.value).toBe('');
  });

  test('does not send empty messages', () => {
    render(<App />);
    const textInput = screen.getByPlaceholderText(/Type a message.../i);
    const sendButton = screen.getByRole('button', { name: /send/i });

    // Try to send empty message
    fireEvent.click(sendButton);

    // Verify API was not called
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  test('shows typing indicator', async () => {
    // Mock delayed API response
    mockedAxios.post.mockImplementationOnce(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({ data: { reply: 'Delayed response', sentiment: 'neutral' } }), 100)
      )
    );

    render(<App />);
    const textInput = screen.getByPlaceholderText(/Type a message.../i);
    const sendButton = screen.getByRole('button', { name: /send/i });

    // Send message
    fireEvent.change(textInput, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    // Check typing indicator appears
    expect(screen.getByText('Bot is typing...')).toBeInTheDocument();

    // Wait for response and check typing indicator disappears
    await waitFor(() => {
      expect(screen.getByText('Delayed response')).toBeInTheDocument();
    });
    
    expect(screen.queryByText('Bot is typing...')).not.toBeInTheDocument();
  });
});