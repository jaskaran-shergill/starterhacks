// src/contexts/AppContext.js

import React, { createContext, useState } from 'react';

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedText, setExtractedText] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);

  const contextValue = {
    selectedFile, setSelectedFile,
    extractedText, setExtractedText,
    question, setQuestion,
    answer, setAnswer,
    generatedQuestions, setGeneratedQuestions,
    currentQuestionIndex, setCurrentQuestionIndex,
    isRecording, setIsRecording,
    recordedAudio, setRecordedAudio,
    feedback, setFeedback,
    loading, setLoading,
    quizQuestions, setQuizQuestions,
    quizAnswers, setQuizAnswers,
    userAnswers, setUserAnswers,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
