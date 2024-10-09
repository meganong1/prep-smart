import React from "react";
import { Typography } from "@mui/material";
import { useCompletion } from "ai/react";
import styles from "../../app/page.module.css";
import { useEffect } from "react";
import useSpeechRecognition from "../../hooks/useSpeechRecognitionHook";

export default function TextField() {
    const { complete, completion, setInput, input, stop, isLoading } = useCompletion({ api: "/api/completion" });
    const { text, startListening, stopListening, isListening, hasRecognitionSupport } = useSpeechRecognition();
    const responsePrompt = "Give me feedback to the interview question: ";

    useEffect(() => {
        if (text) {
            setInput(text);
            let textWithPrompt = responsePrompt + questions[selectedQuestionIndex] 
                + "to the answer (be very specific, keep under 250 words):" 
                + text + ". if the response is too short, be very harsh";
            complete(textWithPrompt);
        }
    }, [text, setInput, complete]);

    return (<>
        <form 
            onSubmit={(e) => {
                e.preventDefault();
                let textWithPrompt =
                responsePrompt + questions[selectedQuestionIndex] + 
                "to the answer (be very specific, keep under 250 words):" + text 
                + ". if the response is too short, be very harsh";
                complete(textWithPrompt);
            }}
            className={styles.chatForm}
        >
            <div className={styles.chat}>
                {hasRecognitionSupport ? (
                    <>
                        <div className={styles.recordingButtons}>
                            <button onClick={(e) => {
                                    e.preventDefault();
                                    startListening();
                                }}
                            >
                                Start Recording
                            </button>
                            {/* <button
                            onClick={(e) => {
                                e.preventDefault();
                                stopListening();
                            }}
                            >
                                Stop Recording
                            </button> */}
                        </div>
                        {isListening ? (<div>Your browser is currently listening</div>) : null}
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
                    <button className={styles.submitbutton} disabled={isLoading} type="submit">
                        {isLoading ? "Loading..." : "Send"}
                    </button>
            </div>
        </form>

      <style jsx global>{`
        body {
          margin: 0px;
          padding: 0px;
        }
      `}</style>

    </>
    );
}