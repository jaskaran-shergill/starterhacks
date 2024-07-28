/* src/pages/QuestionChoicePage.js */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaQuestionCircle, FaGraduationCap, FaClipboardList, FaChalkboardTeacher } from 'react-icons/fa';
import "./QuestionChoicePage.css";

function QuestionChoicePage() {
  const navigate = useNavigate();

  return (
    <div className='optionsContainer'>
      <h1 className="logo" onClick={() => navigate('/')}>Sprout</h1>
      <h1 className='optionsTitle'>What would you like to do today?</h1>
      <div className='gridContainer'>
        <div className="gridItem" onClick={() => navigate('/ask-question')}>
          <FaQuestionCircle size={50} />
          Ask a Question
        </div>
        <div className="gridItem" onClick={() => navigate('/test')}>
          <FaGraduationCap size={50} />
          Test Your Knowledge
        </div>
        <div className="gridItem" onClick={() => navigate('/quiz')}>
          <FaClipboardList size={50} />
          Quiz
        </div>
        <div className="gridItem" onClick={() => navigate('/tutor')}>
          <FaChalkboardTeacher size={50} />
          Tutor
        </div>
      </div>
    </div>
  );
}

export default QuestionChoicePage;
