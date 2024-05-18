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
    <div>
    <form onSubmit={handleSubmit} className="space-y-2">
      <input 
        type="text" 
        value={input} 
        onChange={handleInputChange} 
        placeholder='Submit Response to interview question' 
      />
      <div>
        <button 
          onClick={stop} 
        >
          Stop
        </button>
        <button 
          disabled={isLoading} 
          type='submit' 
        >
          {isLoading ? 'Loading..' : 'Send'}
        </button>
      </div>
    </form>
    <output className="text-lg">
      AI Result: <span className="font-bold">{completion}</span>
    </output>
  </div>  
  )
}