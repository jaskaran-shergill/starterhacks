import React, { useContext } from "react";
import { AppContext } from "../contexts/AppContext";
import "./AskQuestionPage.css";
import { OpenAI } from "openai";
import { useNavigate } from "react-router-dom";

function AskQuestionPage() {
  const navigate = useNavigate();
  const {
    extractedText,
    question,
    setQuestion,
    answer,
    setAnswer,
    loading,
    setLoading,
    educationLevel
  } = useContext(AppContext);

  const handleAskQuestion = async () => {
    if (!extractedText.length || !question) return;
    setLoading(true);

    const openai = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
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
            content: `Context: ${concatenatedText}\nQuestion: ${question}\nAnswer:`,
          },
        ],
      });
      const response = completion.choices[0].message.content;
      setAnswer(response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="questionContainer">
      <h1 className="logo" onClick={() => navigate('/choice')}>Sprout</h1>
      <h1 className="askTitle">ask a question</h1>
      <h5 className="askSubtitle">get any question about your notes answered instantly</h5>
      <div>
        <input
          type="text"
          placeholder="Type a question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="input"
        />
        <button onClick={handleAskQuestion} disabled={loading} className="inputSubmit">
          {loading ? "Loading..." : "Ask"}
        </button>
      </div>
      {answer && (
        <div>
          <h3 className="answerTitle">Answer:</h3>
          <p className="answer">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default AskQuestionPage;
