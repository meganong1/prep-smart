
"use client";

import {useCompletion} from 'ai/react'
import styles from './page.module.css';
import { useState } from 'react'; 
import { useRouter } from 'next/navigation';  

export default function Page() {
  const [inputVal, setInputVal] = useState("");  
  const router = useRouter();

  const handleSubmit = (event) => {
    event.preventDefault(); 
    router.push('/Question') 
  };
  
  const {completion, 
    input, 
    stop, 
    isLoading, 
    handleInputChange, 
    handleSubmit} = useCompletion({api: '/api/completion'})

  return (
    <main className={styles.main}>
      <form onSubmit={handleSubmit}>
      <div className= "chat">
      <input className= "chatbox" 
        type="text" 
        value={input} 
        onChange={handleInputChange} 
        placeholder='Submit response' 
      />
        <button className="stopbutton"
          onClick={stop} 
        >
          Stop
        </button>
        <button className="submitbutton"
          disabled={isLoading} 
          type='submit' 
        >
          {isLoading ? 'Loading..' : 'Send'}
        </button>

      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Type your question..."
            value={inputVal}  
            onChange={(e) => setInputVal(e.target.value)} 
          />
          <button type="submit">Enter</button>
        </form>
      </div>
    </form>
    <output>
      AI Interview Feedback: <span>{completion}</span>
    </output>
  </div>  
  )
}