import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../contexts/AppContext';
import { OpenAI } from 'openai';
import { useNavigate } from 'react-router-dom';
import './QuizPage.css';

function QuizPage() {
  const navigate = useNavigate();
  const {
    extractedText,
    quizQuestions,
    setQuizQuestions,
    quizAnswers,
    setQuizAnswers,
    userAnswers,
    setUserAnswers,
    loading,
    setLoading,
  } = useContext(AppContext);

  const [selectedAnswers, setSelectedAnswers] = useState([]);

  useEffect(() => {
    if (Array.isArray(extractedText) && extractedText.length > 0 && quizQuestions.length === 0) {
      fetchQuizQuestions();
    }
  }, [extractedText]);

  const fetchQuizQuestions = async () => {
    if (!Array.isArray(extractedText) || extractedText.length === 0) return;
    setLoading(true);

    const openai = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    const concatenatedText = extractedText.join('\n');

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          {
            role: 'user',
            content: `Generate 10 quiz questions with multiple choice answers based on the following context:\n\nContext:\n${concatenatedText}\n\nProvide the questions and answers in the following format:\n\nQuestion: <question text>\nA) <choice 1>\nB) <choice 2>\nC) <choice 3>\nD) <choice 4>\nCorrect answer: <correct choice letter and text>\n\n`,
          },
        ],
      });

      const rawQuestions = completion.choices[0].message.content.split('\n\n').filter(Boolean);

      const parsedQuestions = rawQuestions.map((q) => {
        const lines = q.split('\n');
        if (lines.length < 6) {
          console.error('Unexpected format:', lines);
          return null;
        }

        const questionText = lines[0].match(/Question \d+: (.+)/)?.[1]?.trim();
        const choices = lines.slice(1, 5).map(choice => choice.trim());
        const correctAnswer = lines[5].split('Correct answer: ')[1]?.trim();
        
        if (!questionText || !correctAnswer) {
          console.error('Missing question or answer:', { questionText, correctAnswer });
          return null;
        }

        return {
          question: questionText,
          choices,
          answer: correctAnswer
        };
      }).filter(Boolean);

      setQuizQuestions(parsedQuestions);
      setQuizAnswers(parsedQuestions.map((q) => q.answer));
      setSelectedAnswers(Array(parsedQuestions.length).fill(''));
      setLoading(false);
    } catch (error) {
      console.error('Error generating quiz questions:', error);
      setLoading(false);
    }
  };

  const handleAnswerSelection = (choice, index) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[index] = choice;
    setSelectedAnswers(newSelectedAnswers);
  };

  const handleFinishQuiz = () => {
    setUserAnswers(selectedAnswers);
    navigate('/quiz-results');
  };

  if (loading) {
    return <div>Loading, please wait...</div>;
  }

  if (quizQuestions.length === 0) {
    return <div>No quiz questions available.</div>;
  }

  return (
    <div className='quizContainer'>
      <h1 className="logo" onClick={() => navigate('/choice')}>Sprout</h1>
      <div className='quizContent'>
        <div className='quizSidebar'>
          {quizQuestions.map((_, index) => (
            <a
              key={index}
              href={`#question-${index}`}
              className={`sidebarButton ${selectedAnswers[index] ? 'answered' : ''}`}
            >
              {index + 1}
            </a>
          ))}
        </div>
        <div className='quizQuestions'>
          {quizQuestions.map((question, index) => (
            <div key={index} id={`question-${index}`} className='quizQuestionContainer'>
              <h2 className='quizQuestion'>Question {index + 1} (1 point)</h2>
              <p className='quizQuestionText'>{question.question}</p>
              <div className='quizChoices'>
                {question.choices.map((choice, choiceIndex) => (
                  <button
                    key={choiceIndex}
                    onClick={() => handleAnswerSelection(choice, index)}
                    className={`quizChoice ${selectedAnswers[index] === choice ? 'selected' : ''}`}
                  >
                    {choice}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='quizNavigation'>
        <button
          onClick={handleFinishQuiz}
          className='finishButton'
          disabled={selectedAnswers.includes('')}
        >
          Submit Quiz
        </button>
        <p className='savedStatus'>{selectedAnswers.filter(answer => answer).length} of {quizQuestions.length} questions saved</p>
      </div>
    </div>
  );
}

export default QuizPage;
