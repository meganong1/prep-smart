// import {useEffect, useState} from "react";

// let recognition: any = null;
// if ("webkitSpeechRecognition" in window) {
//     recognition = new webkitSpeechRecognition();
//     recognition.continuous = true;
//     recognition.lang = "en-US";
// }

// const useSpeechRecognition = () => {
//     const [text, setText] = useState("");
//     const [isListening, setIsListening] = useState(false);

//     useEffect(() => {
//         if (!recognition) return;

//         recognition.onresult = (event: SpeechRecognitionEvent) => {
//             console.log("onresult event: ", event);
//             setText(event.results[0][0].transcript);
//             recognition.stop();
//             setIsListening(false);
//         };
//     }, []);

//     const startListening = () => {
//         setText("")
//         setIsListening(true)
//         recognition.start()
//     }

//     const stopListening = () => {
//         setIsListening(false);
//         recognition.stop();
//     }

//     return {
//         text,
//         isListening,
//         startListening,
//         stopListening,
//         hasRecognitionSupport: !!recognition,
//     }
// }

// export default useSpeechRecognition;

import { useEffect, useState } from "react";

const useSpeechRecognition = () => {
    const [text, setText] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState<any>(null);

    useEffect(() => {
        // Check if window and webkitSpeechRecognition are available
        if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
            const newRecognition = new (window as any).webkitSpeechRecognition();
            newRecognition.continuous = true;
            newRecognition.lang = "en-US";
            setRecognition(newRecognition);

            newRecognition.onresult = (event: SpeechRecognitionEvent) => {
                console.log("onresult event: ", event);
                setText(event.results[0][0].transcript);
                newRecognition.stop();
                setIsListening(false);
            };
        }
    }, []);

    const startListening = () => {
        if (recognition) {
            setText("");
            setIsListening(true);
            recognition.start();
        }
    };

    const stopListening = () => {
        if (recognition) {
            setIsListening(false);
            recognition.stop();
        }
    };

    return {
        text,
        isListening,
        startListening,
        stopListening,
        hasRecognitionSupport: !!recognition,
    };
};

export default useSpeechRecognition;
