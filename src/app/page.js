"use client";

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

  return (
    <main className={styles.main}>

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
    </main>
  );
}
