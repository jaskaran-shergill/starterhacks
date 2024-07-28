import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AppProvider, AppContext } from './contexts/AppContext';
import PdfUploadPage from './pages/PdfUploadPage';
import QuestionChoicePage from './pages/QuestionChoicePage';
import AskQuestionPage from './pages/AskQuestionPage';
import TestKnowledgePage from './pages/TestKnowledgePage';
import QuizPage from './pages/QuizPage';
import QuizResultsPage from './pages/QuizResultsPage';
import FlashcardPage from './pages/FlashcardPage';
import TutorPage from './pages/TutorPage';
import './App.css';

const PrivateRoute = ({ element: Component, ...rest }) => {
  const { educationLevel, gradeLevel } = useContext(AppContext);
  return educationLevel && gradeLevel ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/choice" />
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PdfUploadPage />} />
          <Route path="/choice" element={<QuestionChoicePage />} />
          <Route path="/test" element={<PrivateRoute element={TestKnowledgePage} />} />
          <Route path="/ask-question" element={<PrivateRoute element={AskQuestionPage} />} />
          <Route path="/quiz" element={<PrivateRoute element={QuizPage} />} />
          <Route path="/quiz-results" element={<PrivateRoute element={QuizResultsPage} />} />
          <Route path="/flashcards" element={<PrivateRoute element={FlashcardPage} />} />
          <Route path="/tutor" element={<PrivateRoute element={TutorPage} />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
