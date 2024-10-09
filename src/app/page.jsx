// "use client";

// import useSpeechRecognition from "../hooks/useSpeechRecognitionHook";
// import styles from "./page.module.css";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useCompletion } from "ai/react";
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import Typography from "@mui/material/Typography";
// import React from "react";
// import NavBar from "../components/NavBar/NavBar";
// import Question from "../components/Question/Question";
// import Response from "../components/Response/Response";
// import TextField from "../components/TextField/TextField"

// export default function Page() {
//     return (
//         <>
//             <NavBar/>
//             <Question/>
//             <Response />
//             <TextField />
//         </>
//     );

// };



"use client";
import useSpeechRecognition from "../hooks/useSpeechRecognitionHook";
import styles from "./page.module.css";
import { useState, useEffect } from "react";
import { useCompletion } from "ai/react";
import Image from "next/image";
import { Box, Button, IconButton, TextField, Typography, Card, CardContent, Alert, Tooltip } from "@mui/material";
import MicIcon from '@mui/icons-material/Mic';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CircularProgress from '@mui/material/CircularProgress';
import StopCircleIcon from '@mui/icons-material/StopCircle';

export default function Page() {
    //left
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

    //right
    const responsePrompt = "Give me feedback to the interview question: ";
    const { complete, completion, setInput, input, stop, isLoading } = useCompletion({ api: "/api/completion" });
    const { text, startListening, stopListening, isListening, hasRecognitionSupport } = useSpeechRecognition();

    useEffect(() => {
        if (text) {
            setInput(text);
            let textWithPrompt = responsePrompt + questions[selectedQuestionIndex] 
                + "You are an interview coach rating interviewee's reponse to this interview question: " + text 
                + "Give the interviewee's response feedback on whether it's good or bad, if it's bad give them actionable stpes to improve. Don't have to give examples.";
            complete(textWithPrompt);
        }
    }, [questions, selectedQuestionIndex, text, setInput, complete]);

  return (
    <div className={styles.main}>
        <div className={styles.top}>
            <Image
                className={styles.logo}
                src="/PrepSmartLogo.png"
                alt="PrepSmart Logo"
                width={210}
                height={72}
            />
            <Button variant="text" sx={{color: "white"}}>Log in</Button>
        </div>
        <div className={styles.bottom}>
            {/*left*/}
            <div className={styles.leftSideColumn}>
                <form onSubmit={handleSubmitQuestion} className={styles.questionForm}>
                    <TextField 
                        fullWidth
                        id="question-input"
                        className={styles.questionInput}
                        label="New Interview Question"
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        sx={{width: "100%"}}
                    />
                    <Button className={styles.addbutton} onClick={handleSubmitQuestion}>Add to List</Button>
                </form>
                <div className={styles.questionList}>
                    <h3>Interview Practice Questions</h3>
                    <div>
                        {questions.map((question, index) => (
                        <Card
                            key={index}
                            style={{
                            marginBottom: "10px",
                            cursor: "pointer",
                            backgroundColor: selectedQuestionIndex === index ? "#798FF3" : "white",
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
            {/*right*/}
            <div className={styles.rightColumn}>
                <output className={styles.output}>
                    <p className={styles.completion}>{completion}</p>
                </output>
                <form className={styles.chatForm}
                    onSubmit={(e) => {
                        e.preventDefault();
                        let textWithPrompt = responsePrompt + questions[selectedQuestionIndex] 
                        + "You are an interview coach rating interviewee's reponse to this interview question: " + text 
                        + "Give the interviewee's response feedback on whether it's good or bad, if it's bad give them actionable stpes to improve. Don't have to give examples.";
                        complete(textWithPrompt);
                    }}>
                    <TextField
                        multiline
                        className={styles.chatbox}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        label="Record or type you response"
                        rows={4}
                        sx = {{ ".MuiInputBase-root": {height: "100%"} }}
                    />
                    <div className={styles.buttonGroup}>
                        {hasRecognitionSupport ? (
                        <>
                            {isListening ? (<IconButton
                                                onClick={(e) => {
                                                e.preventDefault();
                                                stopListening();
                                                }}
                                                color="error"
                                                >
                                                <StopCircleIcon/>
                                            </IconButton>
                                    ) : (
                                    <Tooltip title="Use Speech Rocognition" placement="top">
                                        <IconButton onClick={(e) => {
                                            e.preventDefault();
                                            startListening();
                                            }}
                                            sx={{backgroundColor: "#6d74bd", color: "white"}}
                                        >
                                            <MicIcon />
                                        </IconButton>
                                    </Tooltip>
                            )}
                        </>
                        ) : (
                            <Tooltip title="No Speech Rocognition Support" placement="top">
                                <IconButton disabled color="error">
                                    <MicIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                        <Box sx={{ width: "max-content" }}>
                            <IconButton type="submit" disabled={isLoading} sx={{backgroundColor: "#6d74bd", color: "white"}}>
                                {isLoading? (<CircularProgress color="inherit" size="2rem"/>) : (<ArrowUpwardIcon/>)}
                            </IconButton>
                        </Box>
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
    </div>
  );
}
