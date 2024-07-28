import React, { useContext } from "react";
import { AppContext } from "../contexts/AppContext";
import "./AskQuestionPage.css";
import { OpenAI } from "openai";
import { useNavigate } from "react-router-dom";

function AskQuestionPage() {
  const navigate = useNavigate();
  const {
    extractedTexts,
    question,
    setQuestion,
    answer,
    setAnswer,
    loading,
    setLoading,
  } = useContext(AppContext);

  const handleAskQuestion = async () => {
    if (!extractedTexts.length || !question) return;
    setLoading(true);

    const openai = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    const concatenatedText = extractedTexts.join("\n");

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          {
            role: "user",
            content: `Context: ${concatenatedText}\nQuestion: ${question}\nAnswer:`,
          },
        ],
      });
      const questions = completion.choices[0].message.content
        .split("\n")
        .filter(Boolean);
      setAnswer(questions);
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
