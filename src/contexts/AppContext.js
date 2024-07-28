import React, { createContext, useState, useEffect } from 'react';

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [selectedFile, setSelectedFile] = useState(JSON.parse(localStorage.getItem('selectedFile')) || null);
  const [extractedText, setExtractedText] = useState(JSON.parse(localStorage.getItem('extractedText')) || []);
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
  const [educationLevel, setEducationLevel] = useState(localStorage.getItem('educationLevel') || '');
  const [gradeLevel, setGradeLevel] = useState(localStorage.getItem('gradeLevel') || '');

  useEffect(() => {
    localStorage.setItem('selectedFile', JSON.stringify(selectedFile));
  }, [selectedFile]);

  useEffect(() => {
    localStorage.setItem('extractedText', JSON.stringify(extractedText));
  }, [extractedText]);

  useEffect(() => {
    localStorage.setItem('educationLevel', educationLevel);
  }, [educationLevel]);

  useEffect(() => {
    localStorage.setItem('gradeLevel', gradeLevel);
  }, [gradeLevel]);

  const setEducationAndGradeLevel = (level, grade) => {
    setEducationLevel(level);
    setGradeLevel(grade);
    localStorage.setItem('educationLevel', level);
    localStorage.setItem('gradeLevel', grade);
  };

  const clearAllData = () => {
    setSelectedFile(null);
    setExtractedText([]);
    setEducationLevel('');
    setGradeLevel('');
    localStorage.removeItem('selectedFile');
    localStorage.removeItem('extractedText');
    localStorage.removeItem('educationLevel');
    localStorage.removeItem('gradeLevel');
  };

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
    educationLevel, setEducationLevel,
    gradeLevel, setGradeLevel,
    setEducationAndGradeLevel,
    clearAllData,
  };

  useEffect(() => {
    const savedEducationLevel = localStorage.getItem('educationLevel');
    const savedGradeLevel = localStorage.getItem('gradeLevel');

    if (savedEducationLevel) setEducationLevel(savedEducationLevel);
    if (savedGradeLevel) setGradeLevel(savedGradeLevel);
  }, []);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
