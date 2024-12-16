"use client";
import axios from "axios";
import useSpeechRecognition from "../hooks/useSpeechRecognitionHook";
import styles from "./page.module.css";
import { useState, useEffect, useInsertionEffect } from "react";
import { useCompletion } from "ai/react";
import Image from "next/image";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  Card,
  CardContent,
  Alert,
  Tooltip,
  responsiveFontSizes,
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import CircularProgress from "@mui/material/CircularProgress";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import QuestionList from "../components/QuestionList/QuestionList";
import { useGoogleLogin } from "@react-oauth/google";
import { googleLogout } from "@react-oauth/google";
import db from "../service/firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const auth = getAuth();
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { doc, deleteDoc } from "firebase/firestore";
import {
  setPersistence,
  signInWithEmailAndPassword,
  browserSessionPersistence,
} from "firebase/auth";
setPersistence(auth, browserSessionPersistence)
  .then(() => {

    return signInWithEmailAndPassword(auth, email, password);
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });

export default function Page() {
  //left
  const [inputVal, setInputVal] = useState("");
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("guest");
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setCurrentUserId(user.uid);
        fetchQuestions(user.uid);
        setIsLoggedIn(false);
        setCurrentUserId("guest"); // set to guest if not logged in
        setQuestions([]);
      }
    });

    return () => unsubscribe(); 
  }, []);

  const fetchQuestions = async (userId) => {
    try {
      const q = query(
        collection(db, "questions"),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      const fetchedQuestions = querySnapshot.docs.map(
        (doc) => doc.data().question
      );
      setQuestions(fetchedQuestions);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };
  const handleSubmitQuestion = async (e) => {
    e.preventDefault();

    if (inputVal.trim()) {
      try {
        if (editingIndex !== null) {
          setQuestions(
            questions.map((q, i) => (i === editingIndex ? inputVal : q))
          );
          setEditingIndex(null);
        } else {
          const newQuestion = {
            question: inputVal,
            userId: currentUserId,
            createdAt: new Date(),
          };

          const docRef = await addDoc(collection(db, "questions"), newQuestion);
          console.log("Document written with ID:", docRef.id);

          setQuestions([...questions, inputVal]); 
        }

        setInputVal("");
      } catch (e) {
        console.error("Error adding document:", e);
      }
    }
  };

  const login = useGoogleLogin({
    onSuccess: (tokenInfo) => getUserProfile(tokenInfo),
    onError: (error) => console.log(error),
  });
  const getUserProfile = (tokenInfo) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        console.log("Google API Response:", response);

        localStorage.setItem("user", JSON.stringify(response.data));
        const userId = response.data.id || response.data.email || "guest";
        setCurrentUserId(userId);
        setIsLoggedIn(true);
        fetchQuestions(userId); // get questions after login
      })
      .catch((error) => {
        console.error("Error during Google API call:", error);
      });
  };
  const handleCardClick = (index) => {
    setSelectedQuestionIndex(index);
  };

  const handleEditClick = (index) => {
    setInputVal(questions[index]);
    setEditingIndex(index);
  };

  const handleUpdateQuestion = async () => {
    if (inputVal.trim() && editingIndex !== null) {
      try {
        const questionToUpdate = questions[editingIndex];

        console.log(
          `Attempting to update question: "${questionToUpdate}" to "${inputVal}"`
        );

        const q = query(
          collection(db, "questions"),
          where("userId", "==", currentUserId),
          where("question", "==", questionToUpdate)
        );

        const querySnapshot = await getDocs(q);

        console.log(`Query returned ${querySnapshot.size} document(s)`);

        if (!querySnapshot.empty) {
          const docId = querySnapshot.docs[0].id;
          console.log(`Found document with ID: ${docId}`);

          const docRef = doc(db, "questions", docId);

          await updateDoc(docRef, {
            question: inputVal, 
          });

          console.log(`Document with ID ${docId} successfully updated`);

          setQuestions(
            questions.map((q, i) => (i === editingIndex ? inputVal : q))
          );

          setEditingIndex(null);
          setInputVal(""); 
        } else {
          console.warn("No matching document found for update.");
        }
      } catch (error) {
        console.error("Error updating document:", error);
      }
    } else {
      console.warn("No input value or editing index is null");
    }
  };

  const handleDeleteClick = async (index) => {
    try {
      const questionToDelete = questions[index];

      const q = query(
        collection(db, "questions"),
        where("userId", "==", currentUserId),
        where("question", "==", questionToDelete)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id;
        await deleteDoc(doc(db, "questions", docId));
        console.log(`Document with ID ${docId} deleted`);

        setQuestions(questions.filter((_, i) => i !== index));
        if (selectedQuestionIndex === index) {
          setSelectedQuestionIndex(0);
        }
      } else {
        console.log("No matching question found to delete");
      }
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  //right
  const responsePrompt = "Give me feedback to the interview question: ";
  const { complete, completion, setInput, input, stop, isLoading } =
    useCompletion({ api: "/api/completion" });
  const {
    text,
    startListening,
    stopListening,
    isListening,
    hasRecognitionSupport,
  } = useSpeechRecognition();

  useEffect(() => {
    if (text) {
      setInput(text);
      let textWithPrompt =
        responsePrompt +
        questions[selectedQuestionIndex] +
        "You are an interview coach evaluating an interviewee's response to the question: " +
        text +
        "Provide feedback directly to the interviewee. Share one positive aspect of their response and one area where they could improve. Keep the feedback natural and conversational, without using bullet points or a formal structure. Focus on providing constructive guidance in under 200 words.";
      complete(textWithPrompt);
    }
  }, [questions, selectedQuestionIndex, text, setInput, complete]);

  return (
    <div className={styles.main}>
      <div className={styles.top}>
        <Image
          className={styles.logo}
          src="/PrepSmartLogo.png"
          alt="PrepSmart Logo"
          width={210}
          height={72}
        />
        {isLoggedIn ? (
          <Button
            variant="text"
            sx={{ color: "white" }}
            onClick={() => {
              googleLogout();
              setIsLoggedIn(false);
              localStorage.clear();
            }}
          >
            Log Out
          </Button>
        ) : (
          <Button variant="text" sx={{ color: "white" }} onClick={login}>
            Sign in
          </Button>
        )}
      </div>
      <div className={styles.bottom}>
        {/*left*/}
        <div className={styles.leftSideColumn}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (editingIndex !== null) {
                console.log("Calling handleUpdateQuestion");
                handleUpdateQuestion(); // update function if editing
              } else {
                console.log("Calling handleSubmitQuestion");
                handleSubmitQuestion(e); 
              }
            }}
            className={styles.questionForm}
          >
            {" "}
            <TextField
              fullWidth
              id="question-input"
              className={styles.questionInput}
              label={editingIndex !== null ? "Edit question" : "New question"}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              sx={{ width: "100%" }}
            />
            <Button type="submit" className={styles.addbutton}>
              {editingIndex !== null ? "Update" : "Add to List"}
            </Button>
          </form>
          <QuestionList
            questions={questions}
            selectedQuestionIndex={selectedQuestionIndex}
            onCardClick={handleCardClick}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
          />
        </div>
        {/*right*/}
        <div className={styles.rightColumn}>
          <output className={styles.output}>
            <p className={styles.completion}>{completion}</p>
          </output>
          <form
            className={styles.chatForm}
            onSubmit={(e) => {
              e.preventDefault();
              let textWithPrompt =
                responsePrompt +
                questions[selectedQuestionIndex] +
                "You are an interview coach evaluating an interviewee's response to the following question:  " +
                text +
                ".  Provide feedback directly to the interviewee. Share one positive aspect of their response and one area where they could improve. Keep the feedback natural and conversational without using bullet points or a formal structure. Focus on giving constructive guidance under 200 words.";
              complete(textWithPrompt);
            }}
          >
            <TextField
              multiline
              className={styles.chatbox}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              label="Record or type your response"
              rows={4}
              sx={{ ".MuiInputBase-root": { height: "100%" } }}
            />
            <div className={styles.buttonGroup}>
              {hasRecognitionSupport ? (
                <>
                  {isListening ? (
                    <IconButton
                      onClick={(e) => {
                        e.preventDefault();
                        stopListening();
                      }}
                      color="error"
                    >
                      <StopCircleIcon />
                    </IconButton>
                  ) : (
                    <Tooltip title="Use Speech Rocognition" placement="top">
                      <IconButton
                        onClick={(e) => {
                          e.preventDefault();
                          startListening();
                        }}
                        sx={{ backgroundColor: "#6d74bd", color: "white" }}
                      >
                        <MicIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </>
              ) : (
                <Tooltip title="No Speech Rocognition Support" placement="top">
                  <IconButton disabled color="error">
                    <MicIcon />
                  </IconButton>
                </Tooltip>
              )}
              <Box sx={{ width: "max-content" }}>
                <IconButton
                  type="submit"
                  disabled={isLoading}
                  sx={{ backgroundColor: "#6d74bd", color: "white" }}
                >
                  {isLoading ? (
                    <CircularProgress color="inherit" size="2rem" />
                  ) : (
                    <ArrowUpwardIcon />
                  )}
                </IconButton>
              </Box>
            </div>
          </form>
        </div>
        <style jsx global>{`
          body {
            margin: 0px;
            padding: 0px;
          }
        `}</style>
      </div>
    </div>
  );
}
