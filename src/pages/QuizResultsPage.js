import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import './QuizResultsPage.css';

function QuizResultsPage() {
  const navigate = useNavigate();
  const { quizQuestions, userAnswers, setQuizQuestions, setUserAnswers, setQuizAnswers } = useContext(AppContext);

  const handleRetry = () => {
    setUserAnswers([]);
    navigate('/quiz');
  };

  const handleNewTest = () => {
    setQuizQuestions([]);
    setQuizAnswers([]);
    setUserAnswers([]);
    navigate('/quiz');
  };

  const calculateScore = () => {
    let score = 0;
    quizQuestions.forEach((question, index) => {
      if (userAnswers[index] === question.answer) {
        score++;
      }
    });
    return score;
  };

  return (
    <div className="resultsContainer">
      <h1 className="logo" onClick={() => navigate('/choice')}>Sprout</h1>
      <h1>Quiz Results</h1>
      <p className="score">Your score is {calculateScore()} out of {quizQuestions.length}</p>
      <div className="resultsDetails">
        {quizQuestions.map((question, index) => (
          <div key={index} className={`resultQuestion ${userAnswers[index] === question.answer ? 'correct' : 'incorrect'}`}>
            <h2>Question {index + 1}</h2>
            <p>{question.question}</p>
            <p className="userAnswer">Your answer: {userAnswers[index]}</p>
            <p className="correctAnswer">Correct answer: {question.answer}</p>
          </div>
        ))}
      </div>
      <div className="resultsButtons">
        <button onClick={handleRetry} className="retryButton">Retry Same Test</button>
        <button onClick={handleNewTest} className="newTestButton">Get a New Test</button>
      </div>
    </div>
  );
}

export default QuizResultsPage;
