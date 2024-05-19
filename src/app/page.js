'use client';

import styles from './page.module.css';
import { useState } from 'react'; 
import { useRouter } from 'next/navigation';  
import { useCompletion } from 'ai/react'; // Ensure this is a valid import or replace with appropriate logic

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
      <form onSubmit={handleSubmit} className={styles.chatForm}>
        <div className={styles.chat}>
          <input className={styles.chatbox}
            type="text" 
            value={input} 
            onChange={handleInputChange} 
            placeholder='Submit response'
          />
          <button className={styles.stopbutton} onClick={stop}>
            Stop
          </button>
          <button className={styles.submitbutton} disabled={isLoading} type='submit'>
            {isLoading ? 'Loading..' : 'Send'}
          </button>
        </div>
      </form>
      <output className={styles.output}>
        <span>{completion}</span>
      </output>
      <form onSubmit={handleSubmitQuestion} className={styles.questionForm}>
        <input
          id="question-input"
          type="text"
          placeholder="Type your question..."
          value={inputVal}  
          onChange={(e) => setInputVal(e.target.value)}
        />
      </form>
      <div className={styles.questionList}>
        <h3>Interview Questions</h3>
        {questions.map((question, index) => (
          <p key={index} className={styles.questionItem}>{question}</p> 
        ))}
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
    </div>  
  );
}
