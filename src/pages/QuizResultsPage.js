import React, { useContext, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import './QuizResultsPage.css';

function QuizResultsPage() {
  const navigate = useNavigate();
  const { quizQuestions, quizAnswers, userAnswers, setUserAnswers } = useContext(AppContext);

  useEffect(() => {
    if (userAnswers.length === 0) {
      navigate('/quiz');
    }
  }, [userAnswers, navigate]);

  const getGrade = () => {
    let correctAnswers = 0;
    userAnswers.forEach((answer, index) => {
      if (answer === quizAnswers[index]) {
        correctAnswers++;
      }
    });
    return ((correctAnswers / quizAnswers.length) * 100).toFixed(2);
  };

  return (
    <div className='resultsContainer'>
      <h1 className="logo" onClick={() => navigate('/choice')}>Sprout</h1>
      <h2 className='resultsTitle'>Quiz Results</h2>
      <p className='resultsScore'>Your Score: {getGrade()}%</p>
      <div className='resultsDetails'>
        {quizQuestions.map((questionObj, index) => (
          <div key={index} className='resultItem'>
            <p className='resultQuestion'>{index + 1}. {questionObj.question}</p>
            <p className={`resultAnswer ${userAnswers[index] === quizAnswers[index] ? 'correct' : 'incorrect'}`}>
              Your Answer: {userAnswers[index]} <br />
              {userAnswers[index] !== quizAnswers[index] && <span>Correct Answer: {quizAnswers[index]}</span>}
            </p>
          </div>
        ))}
      </div>
      <button onClick={() => { setUserAnswers([]); navigate('/quiz'); }} className='retryButton'>Retry Quiz</button>
    </div>
  );
}

export default QuizResultsPage;
