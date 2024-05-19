'use client';

import styles from './page.module.css';
import { useState } from 'react'; 
import { useRouter } from 'next/navigation';  
import { useCompletion } from 'ai/react'; // Ensure this is a valid import or replace with appropriate logic
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export default function Page() {
  const [inputVal, setInputVal] = useState("");  
  const [questions, setQuestions] = useState([]); // Now using an array to store questions
  const router = useRouter();

  // Handle submission of the question form
  const handleSubmitQuestion = (e) => {
    e.preventDefault();
    if (inputVal.trim()) { // Only add the question if it's not empty
      setQuestions(prevQuestions => [...prevQuestions, inputVal]); // Add the new question to the list
      setInputVal(''); // Clear the input field after setting the question
    }
  };

  const {completion, input, stop, isLoading, handleInputChange, handleSubmit} = useCompletion({api: '/api/completion'});

  return (
    <div className={styles.main}>
      <form onSubmit={handleSubmit}>
        <div className="chat">
          <input className="chatbox"
            type="text" 
            value={input} 
            onChange={handleInputChange} 
            placeholder='Submit response'
          />
          <button className="stopbutton" onClick={stop}>
            Stop
          </button>
          <button className="submitbutton" disabled={isLoading} type='submit'>
            {isLoading ? 'Loading..' : 'Send'}
          </button>
        </div>
      </form>
      <output className="text">
        AI Interview Feedback: <span>{completion}</span>
      </output>
      <div>
        <form onSubmit={handleSubmitQuestion}>
          <input
            id="question-input"
            type="text"
            placeholder="Type your question..."
            value={inputVal}  
            onChange={(e) => setInputVal(e.target.value)}
          />
          <button type="submit">Enter</button>
        </form>
        <h3>Interview Questions</h3>
        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {questions.map((question, index) => (
        <Card key={index} style={{ marginBottom: '10px' }}>
          <CardContent>
            <Typography variant="body1">{question}</Typography>
          </CardContent>
        </Card>
      ))}
        </div>
      </div>

      <main className={styles.main}>

        <div className={styles.center}>
        <img
          className={styles.logo}
          src="/PrepSmartLogo.png"
          alt="PrepSmart Logo"
          width={200}
          height={100}
        />
        </div>
        <div className={styles.container}>
        <h1 className={styles.coolText}>PrepSmart</h1>
        </div>
      </main>

    </div>  
  );
}
