"use client";

import useSpeechRecognition from "../hooks/useSpeechRecognitionHook";
import styles from "./page.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCompletion } from "ai/react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export default function Page() {
  const [inputVal, setInputVal] = useState("");
  const [questions, setQuestions] = useState([
    "When is one time you worked well in a team?",
    "How have you dealt with a failure at the workplace?",
    "Share an example of how you dealt with a difficult client.",
    "What do you do if you disagree with someone at work?",
    "Describe any goal you reached and how you achieved it.",
    "Why should I hire you?",
    "How do you approach problems? What is your process?",
  ]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const router = useRouter();
  const responsePrompt = "Give me feedback to the interview question: ";
  // const [questionPrompt, setQuestionPrompt] = useState(null);

  const handleSubmitQuestion = (e) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setQuestions((prevQuestions) => [...prevQuestions, inputVal]);
      setInputVal("");
    }
  };

  const handleCardClick = (index) => {
    setSelectedQuestionIndex(index);
  };

  const { complete, completion, setInput, input, stop, isLoading } =
    useCompletion({ api: "/api/completion" });
  const {
    text,
    startListening,
    stopListening,
    isListening,
    hasRecognitionSupport,
  } = useSpeechRecognition();

  useEffect(() => {
    if (text) {
      setInput(text);
      let textWithPrompt =
        responsePrompt +
        questions[selectedQuestionIndex] +
        "to the answer (be very specific, keep under 250 words):" +
        text +
        ". if the response is too short, be very harsh";
      complete(textWithPrompt);
    }
  }, [text, complete]);

  return (
    <div className={styles.main}>
      <div className={styles.leftSideColumn}>
        <div className={styles.center}>
          <img
            className={styles.logo}
            src="/PrepSmartLogo.png"
            alt="PrepSmart Logo"
            width={200}
            height={100}
          />
        </div>
        <form onSubmit={handleSubmitQuestion} className={styles.questionForm}>
          <input
            id="question-input"
            type="text"
            placeholder="Type your question..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
          />
          <div className="submitQuestion">
            <button
              className={styles.submitbutton}
              onSubmit={handleSubmitQuestion}
            >
              Submit Interview Question
            </button>
          </div>
        </form>
        <div className={styles.questionList}>
          <h3>Interview Questions</h3>
          <div>
            {questions.map((question, index) => (
              <Card
                key={index}
                style={{
                  marginBottom: "10px",
                  cursor: "pointer",
                  backgroundColor:
                    selectedQuestionIndex === index ? "#798FF3" : "white",
                }}
                onClick={() => handleCardClick(index)}
              >
                <CardContent>
                  <Typography variant="body1">{question}</Typography>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.rightColumn}>
        <output className={styles.output}>
          <span>{completion}</span>
        </output>
        <form
          onSubmit={(e) => {
            e.preventDefault();

            let textWithPrompt =
              responsePrompt +
              questions[selectedQuestionIndex] +
              "to the answer (be very specific, keep under 250 words):" +
              text +
              ". if the response is too short, be very harsh";

            complete(textWithPrompt);
          }}
          className={styles.chatForm}
        >
          <div className={styles.chat}>
            {hasRecognitionSupport ? (
              <>
                <div className={styles.recordingButtons}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      startListening();
                    }}
                  >
                    Start Recording
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      stopListening();
                    }}
                  >
                    Stop Recording
                  </button>
                </div>
                {isListening ? (
                  <div>Your browser is currently listening</div>
                ) : null}
              </>
            ) : (
              <Typography variant="h5">
                Your browser has no speech recognition support
              </Typography>
            )}
            <textarea
              className={styles.chatbox}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Record or type response here..."
              rows="4"
            ></textarea>
            {/* <button className={styles.stopbutton} onClick={stop}>
            Stop
          </button> */}
            <button
              className={styles.submitbutton}
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? "Loading..." : "Send"}
            </button>
          </div>
        </form>
      </div>
      <style jsx global>{`
        body {
          margin: 0px;
          padding: 0px;
        }
      `}</style>
    </div>
  );
}
