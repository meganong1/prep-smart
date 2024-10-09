"use client";
import styles from "../../app/page.module.css";
import { useState, FormEvent} from 'react';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";

export default function Question() {
    const [inputVal, setInputVal] = useState("");
    const [questions, setQuestions] = useState([
        "When is one time you worked well in a team?",
        "How have you dealt with a failure at the workplace?",
        "Share an example of how you dealt with a difficult client.",
        "What do you do if you disagree with someone at work?",
        "Describe any goal you reached and how you achieved it.",
        "Why should I hire you?",
        "How do you approach problems? What is your process?"
    ]);
    const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);

    const handleSubmitQuestion = (e) => {
        console.log("button clicked");
        e.preventDefault();
        if (inputVal.trim()) {
          setQuestions((prevQuestions) => [...prevQuestions, inputVal]);
          setInputVal("");
        };
    };

    const handleCardClick = (index) => {
        setSelectedQuestionIndex(index);
    };

  return (
    <>
        <form onSubmit={handleSubmitQuestion} className={styles.questionForm}>
            <input
                id="question-input"
                type="text"
                placeholder="Type your question..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
            />
            <div className="submitQuestion">
                {/* <button className={styles.submitbutton} onSubmit={handleSubmitQuestion}>Submit Interview Question</button> */}
                <Button onClick={handleSubmitQuestion}>Submit Questions</Button>
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
                        selectedQuestionIndex === index ? "#798FF3" : "white"}}
                    onClick={() => handleCardClick(index)}
                    >
                        <CardContent>
                            <Typography variant="body1">{question}</Typography>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    </>
  );
}
