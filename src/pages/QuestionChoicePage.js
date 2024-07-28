import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import { FaQuestionCircle, FaGraduationCap, FaClipboardList, FaChalkboardTeacher, FaBook } from 'react-icons/fa';
import './QuestionChoicePage.css';

function QuestionChoicePage() {
  const navigate = useNavigate();
  const { setEducationLevel } = useContext(AppContext);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');

  const handleEducationLevelChange = (event) => {
    const level = event.target.value;
    setSelectedLevel(level);
    setEducationLevel(level);
  };

  const handleGradeLevelChange = (event) => {
    const grade = event.target.value;
    setSelectedGrade(grade);
  };

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
        <div className="gridItem" onClick={() => navigate('/flashcards')}>
          <FaBook size={50} />
          Flashcards
        </div>
        <div className="gridItem" onClick={() => navigate('/tutor')}>
          <FaChalkboardTeacher size={50} />
          Tutor
        </div>
      </div>
      <div className="selectionContainer">
        <h2 className="selectionTitle">Select Your Education Level and Grade</h2>
        <div className="dropdowns">
          <select
            id="educationLevel"
            value={selectedLevel}
            onChange={handleEducationLevelChange}
            className="dropdown"
          >
            <option value="" disabled>Select Education Level</option>
            <option value="Elementary">Elementary</option>
            <option value="Middle">Middle School</option>
            <option value="High">High School</option>
            <option value="University">University/College</option>
          </select>
          {selectedLevel && (
            <select
              id="gradeLevel"
              value={selectedGrade}
              onChange={handleGradeLevelChange}
              className="dropdown"
            >
              <option value="" disabled>Select Grade</option>
              {selectedLevel === 'Elementary' && (
                <>
                  <option value="1">Grade 1</option>
                  <option value="2">Grade 2</option>
                  <option value="3">Grade 3</option>
                  <option value="4">Grade 4</option>
                  <option value="5">Grade 5</option>
                  <option value="6">Grade 6</option>
                </>
              )}
              {selectedLevel === 'Middle' && (
                <>
                  <option value="7">Grade 7</option>
                  <option value="8">Grade 8</option>
                </>
              )}
              {selectedLevel === 'High' && (
                <>
                  <option value="9">Grade 9</option>
                  <option value="10">Grade 10</option>
                  <option value="11">Grade 11</option>
                  <option value="12">Grade 12</option>
                </>
              )}
              {selectedLevel === 'University' && (
                <>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                  <option value="5">Graduate</option>
                </>
              )}
            </select>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuestionChoicePage;
