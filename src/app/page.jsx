'use client';

import useSpeechRecognition from "../hooks/useSpeechRecognitionHook";
import styles from './page.module.css';
import { useState, useEffect } from 'react'; 
import { useRouter } from 'next/navigation';  
import { useCompletion } from 'ai/react'; 
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export default function Page() {
  const [inputVal, setInputVal] = useState("");
  const [questions, setQuestions] = useState(['When is one time you worked well in a team?',
'How have you dealt with a failure at the workplace?',
'Share an example of how you dealt with a difficult client.',
'What do you do if you disagree with someone at work?',
'Describe any goal you reached and how you achieved it.',
'Why should I hire you?',
'How do you approach problems? What is your process?']);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const router = useRouter();
  const responsePrompt = 'Give me feedback to the interview question: ';
  // const [questionPrompt, setQuestionPrompt] = useState(null);

  const handleSubmitQuestion = (e) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setQuestions(prevQuestions => [...prevQuestions, inputVal]);
      setInputVal('');
    }
  };

  const handleCardClick = (index) => {
    setSelectedQuestionIndex(index);
  };

  const {complete, completion, setInput, input, stop, isLoading} = useCompletion({api: '/api/completion'});
  const {text, startListening, stopListening, isListening, hasRecognitionSupport} = useSpeechRecognition();

  // useEffect(() => {
  //   if (completion) {
  //     setInputVal(completion);
  //   }
  // }, [completion]);

  useEffect(() => {
    if (text) {
      setInput(text);
      let textWithPrompt = responsePrompt + questions[selectedQuestionIndex]+'to this answer (be harsh and specific):'+text;
      complete(textWithPrompt);
    }
  }, [text, complete]);

  return (
    <div className={styles.main}>
      <form onSubmit={(e) => { e.preventDefault();

            let textWithPrompt = responsePrompt + questions[selectedQuestionIndex] + 'to this answer (be harsh and specific):'+input;

            complete(textWithPrompt); 
        
        }} className={styles.chatForm}>
        <div className={styles.chat}>
          <input
            className={styles.chatbox}
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)} 
            placeholder='Submit response'
          />
          <button className={styles.stopbutton} onClick={stop}>
            Stop
          </button>
          <button className={styles.submitbutton} disabled={isLoading} type='submit'>
            {isLoading ? 'Loading...' : 'Send'}
          </button>
        </div>
      </form>
      <div>
      <output className={styles.output}>
        <span>
        {completion}</span>
      </output>
      </div>
      <form onSubmit={handleSubmitQuestion} className={styles.questionForm}>
        <input
          id="question-input"
          type="text"
          placeholder="Type your question..."
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
        />
      </form>
      <div className={styles.questionList}>
        <h3>Interview Questions</h3>
        <div>
          {questions.map((question, index) => (
            <Card
              key={index}
              style={{
                marginBottom: '10px',
                cursor: 'pointer',
                backgroundColor: selectedQuestionIndex === index ? 'yellow' : 'white'
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
      <div className={styles.center}>
        <img
          className={styles.logo}
          src="/PrepSmartLogo.png"
          alt="PrepSmart Logo"
          width={200}
          height={100}
        />
      </div>
      
      {hasRecognitionSupport ? (
        <>
          <div>
            <button onClick={startListening}>Start Listening</button>
            <button onClick={stopListening}>Stop Listening</button>
          </div>
          {isListening ? <div>Your browser is currently listening</div> : null}
        </>
      ) : (
        <Typography variant="h5">Your browser has no speech recognition support</Typography>
      )}
    </div>
  );
}
