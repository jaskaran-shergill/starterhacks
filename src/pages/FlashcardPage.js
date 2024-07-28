import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../contexts/AppContext';
import './FlashcardPage.css';
import { OpenAI } from 'openai';
import { useNavigate } from 'react-router-dom';

function FlashcardPage() {
  const navigate = useNavigate();
  const { extractedText } = useContext(AppContext);
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateFlashcards();
  }, [extractedText]);

  const generateFlashcards = async () => {
    if (!extractedText.length || !process.env.REACT_APP_OPENAI_API_KEY) return;
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
          {
            role: 'user',
            content: `Create 20 flashcards based on the following context:\n\nContext:\n${concatenatedText}\n\nEach flashcard should have a question and answer. Format:\n\nQuestion: <question>\nAnswer: <answer>\n\n`
          },
        ],
      });

      const rawFlashcards = completion.choices[0].message.content.split('\n\n').filter(Boolean);

      const parsedFlashcards = rawFlashcards.map((fc) => {
        const parts = fc.split('\n').filter(Boolean);
        const question = parts[0].split('Question: ')[1]?.trim();
        const answer = parts[1].split('Answer: ')[1]?.trim();
        return { question, answer };
      });

      setFlashcards(parsedFlashcards);
    } catch (error) {
      console.error('Error generating flashcards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
    setFlipped(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
    setFlipped(false);
  };

  const handleReset = () => {
    generateFlashcards();
    setCurrentIndex(0);
    setFlipped(false);
  };

  if (loading) {
    return <div className="loading">Loading, please wait...</div>;
  }

  return (
    <div className="flashcardContainer">
      <h1 className="logo" onClick={() => navigate('/choice')}>Sprout</h1>
      <h1 className="flashcardTitle">Flashcards</h1>
      <div className="flashcard">
        <div className={`flashcardContent ${flipped ? 'flipped' : ''}`} onClick={handleFlip}>
          {flashcards.length > 0 ? (
            <>
              <div className="flashcardFront">
                <p className="flashcardText">{flashcards[currentIndex].question}</p>
              </div>
              <div className="flashcardBack">
                <p className="flashcardText">{flashcards[currentIndex].answer}</p>
              </div>
            </>
          ) : (
            <button onClick={generateFlashcards} disabled={loading}>
              {loading ? "Generating..." : "Generate Flashcards"}
            </button>
          )}
        </div>
      </div>
      <div className="flashcardButtons">
        <button onClick={handlePrev} disabled={flashcards.length === 0}>&larr; Previous</button>
        <button onClick={handleNext} disabled={flashcards.length === 0}>Next &rarr;</button>
      </div>
      <button onClick={handleReset} className="resetButton">Reset Flashcards</button>
    </div>
  );
}

export default FlashcardPage;
