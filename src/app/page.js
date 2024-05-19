"use client";

import useSpeechRecognition from "../hooks/useSpeechRecognitionHook"
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

  const {
            text, 
            startListening, 
            stopListening, 
            isListening, 
            hasRecognitionSupport
        } = useSpeechRecognition();

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

      <div>
             {hasRecognitionSupport ? (
                <>
                    <div>
                        <button onClick={startListening}>Start Listening</button>
                    </div>

                    <div>
                        <button onClick={stopListening}>Stop Listening</button>
                    </div>

                    {isListening ? (<div>Your browser is currently listening</div>) : null}
                    {text}
                </>
            ) : (
                <h1>Your browser has no speech recognition support</h1>
            )}
        </div>
        
    </main>
  );
}






// const Main = () => {
//     const {
//         text, 
//         startListening, 
//         stopListening, 
//         isListening, 
//         hasRecognitionSupport
//     } = useSpeechRecognition();

//     return (
//         <div>
//             {hasRecognitionSupport ? (
//                 <>
//                     <div>
//                         <button onClick={startListening}>Start Listening</button>
//                     </div>

//                     <div>
//                         <button onClick={stopListening}>Stop Listening</button>
//                     </div>

//                     {isListening ? (<div>Your browser is currently listening</div>) : null}
//                     {text}
//                 </>
//             ) : (
//                 <h1>Your browser has no speech recognition support</h1>
//             )}
//         </div>
//     );
// }

// export default Main;

