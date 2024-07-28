import React, { useContext, useState } from 'react';
import { AppContext } from '../contexts/AppContext';
import './TutorPage.css';
import { OpenAI } from 'openai';
import { useNavigate } from 'react-router-dom';

function TutorPage() {
  const navigate = useNavigate();
  const { extractedText, educationLevel, gradeLevel } = useContext(AppContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    const openai = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    const concatenatedText = extractedText.join("\n");

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'system', content: `Context: ${concatenatedText}` },
          { role: 'system', content: `The user is in ${educationLevel} level and grade ${gradeLevel}.`
        },
          ...newMessages,
        ],
      });

      const assistantMessage = {
        role: 'assistant',
        content: completion.choices[0].message.content,
      };

      setMessages([...newMessages, assistantMessage]);
    } catch (error) {
      console.error('Error communicating with ChatGPT:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tutorContainer">
      <h1 className="logo" onClick={() => navigate('/choice')}>Back</h1>
      <h1 className="tutorTitle">Tutor</h1>
      <div className="chatContainer">
        <div className="messagesContainer">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              {msg.content}
            </div>
          ))}
        </div>
        <div className="inputContainer">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
            placeholder="Type your message..."
            disabled={loading}
            className="inputField"
          />
          <button onClick={handleSendMessage} disabled={loading || !input.trim()} className="sendButton">
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TutorPage;
