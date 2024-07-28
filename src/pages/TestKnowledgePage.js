import React, { useContext, useEffect, useRef } from 'react';
import { AppContext } from '../contexts/AppContext';
import MicRecorder from 'mic-recorder-to-mp3';
import { OpenAI } from 'openai';
import axios from 'axios';
import "./TestKnowledgePage.css";
import recording from '../assets/recording.svg';
import stopRecord from '../assets/paused.svg';
import { useNavigate } from 'react-router-dom';

function TestKnowledgePage() {
  const navigate = useNavigate();
  const {
    extractedText,
    generatedQuestions,
    setGeneratedQuestions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    isRecording,
    setIsRecording,
    recordedAudio,
    setRecordedAudio,
    feedback,
    setFeedback,
    loading,
    setLoading,
    educationLevel
  } = useContext(AppContext);

  const recorder = useRef(null);

  useEffect(() => {
    recorder.current = new MicRecorder({ bitRate: 128 });
  }, []);

  const handleGenerateQuestions = async () => {
    if (!extractedText.length || !process.env.REACT_APP_OPENAI_API_KEY) return;
    setLoading(true);

    const openai = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });

    const concatenatedText = extractedText.join("\n");

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "system", content: `The user is in ${educationLevel} level.` },
          {
            role: "user",
            content: `Generate 5 relevant questions based on the context below:\n\nContext:\n${concatenatedText}\n\nQuestions:`,
          },
        ],
      });
      const questions = completion.choices[0].message.content.split('\n').filter(Boolean);
      setGeneratedQuestions(questions);
    } catch (error) {
      console.error('Error generating questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = () => {
    recorder.current.start().then(() => {
      setIsRecording(true);
    }).catch(error => {
      console.error('Error starting recording:', error);
    });
  };

  async function stopRecording() {
    try {
      const [buffer, blob] = await recorder.current.stop().getMp3();
      setIsRecording(false);
      setLoading(true);

      if (blob.type !== 'audio/mp3') {
        console.error('Invalid audio recording. Ensure it is in MP3 format.');
        setLoading(false);
        return;
      }

      const audioFile = new File(buffer, 'myFile.mp3', { type: blob.type, lastModified: Date.now() });
      setRecordedAudio(audioFile);

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Audio = reader.result.split(',')[1];

        try {
          const response = await axios.post(
            `https://speech.googleapis.com/v1/speech:recognize?key=${process.env.REACT_APP_GOOGLE_API_KEY}`,
            {
              audio: { content: base64Audio },
              config: {
                encoding: 'MP3',
                sampleRateHertz: 16000,
                languageCode: 'en-US',
              },
            },
            {
              headers: { 'Content-Type': 'application/json' },
            }
          );

          if (!response.data.results || response.data.results.length === 0) {
            console.error('No transcription results found in API response:', response.data);
            return;
          }

          const transcription = response.data.results[0].alternatives[0].transcript;
          handleGradeResponse(transcription);
        } catch (transcriptionError) {
          console.error('Transcription error:', transcriptionError);
        } finally {
          setLoading(false);
        }
      };

      reader.readAsDataURL(audioFile);
    } catch (recordingError) {
      console.error('Error stopping recording:', recordingError);
      setLoading(false);
    }
  }

  const handleGradeResponse = async (transcription) => {
    if (!transcription || !process.env.REACT_APP_OPENAI_API_KEY) return;
    setLoading(true);

    const openai = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });

    const concatenatedText = extractedText.join("\n");
    const currentQuestion = generatedQuestions[currentQuestionIndex];

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a grader, you provide grading on the answer you're provided based on the context given and to the question given." },
          { role: "system", content: `The user is in ${educationLevel} level.` },
          {
            role: "user",
            content: `Grade and provide feedback on the following response to a question, based on the context. 
            Give it a grading of the answer based on the context. Be kind on the marking, don't be harsh. Concise is good, detailed is also good. Give it a grade out of 100 and provide a brief explanation of the grade.

            Context:\n${concatenatedText}\n
            Question: ${currentQuestion}\n
            Response: ${transcription}\n\n
            Grade:`,
          },
        ],
      });
      setFeedback(completion.choices[0].message.content);
    } catch (error) {
      console.error('Error getting feedback from OpenAI:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < generatedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setFeedback('');
      setRecordedAudio(null);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setFeedback('');
      setRecordedAudio(null);
    }
  };

  useEffect(() => {
    if (generatedQuestions.length === 0) {
      handleGenerateQuestions();
    }
  }, [extractedText]);

  if (loading) {
    return <div className='loading'>Loading, please wait...</div>;
  }

  return (
    <div className='testContainer'>
      <div className='leftContainer'>
        <h1 className="logo" onClick={() => navigate('/choice')}>Sprout</h1>
        <h1 className='testTitle'>Test Your Knowledge</h1>
        <h5 className='testSubtitle'>record yourself answering these questions and receive feedback</h5>
        {generatedQuestions.length > 0 && (
          <div>
            <p className='question'>{generatedQuestions[currentQuestionIndex]}</p>
            {feedback && (
              <div>
                <h4>Feedback:</h4>
                <p>{feedback}</p>
              </div>
            )}
            <button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0 || isRecording || loading}>
              Previous Question
            </button>
            <button onClick={handleNextQuestion} disabled={currentQuestionIndex >= generatedQuestions.length - 1 || isRecording || loading}>
              Next Question
            </button>
          </div>
        )}
      </div>
      <div className='rightContainer'>
        {isRecording ? (
          <button onClick={stopRecording} disabled={!isRecording}>
            <img src={recording} alt="Stop Recording" />
          </button>
        ) : (
          <button onClick={startRecording} disabled={isRecording}>
            <img src={stopRecord} alt="Start Recording" />
          </button>
        )}
      </div>
    </div>
  );
}

export default TestKnowledgePage;
