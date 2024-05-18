'use client';
import {useCompletion} from 'ai/react'

export default function Home() {
  const {completion, 
    input, 
    stop, 
    isLoading, 
    handleInputChange, 
    handleSubmit} = useCompletion({api: '/api/completion'})

  return (
    <div className="app">
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
      </div>
    </form>
    <output>
      AI Interview Feedback: <span>{completion}</span>
    </output>
  </div>  
  )
}