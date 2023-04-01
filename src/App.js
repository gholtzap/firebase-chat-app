import './App.css';

import { useEffect, useState, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from "firebase/database";
import { getAuth, signInWithPopup, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";

const API_KEY = process.env.REACT_APP_API_KEY
const AUTH_DOMAIN = process.env.REACT_APP_AUTH_DOMAIN
const PROJECT_ID = process.env.REACT_APP_PROJECT_ID
const STORAGE_BUCKET = process.env.REACT_APP_STORAGE_BUCKET
const MESSAGE_SENDER_ID = process.env.REACT_APP_MESSAGE_SENDER_ID
const APP_ID = process.env.REACT_APP_ID
const MEASUREMENT_ID = process.env.REACT_APP_MEASUREMENT_ID


const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGE_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app)
const messagesRef = ref(database, 'messages');

function App() {

  const [messages, setMessages] = useState([]);
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [userData, setUserData] = useState([])
  const inputRef = useRef(null);
  const auth = getAuth(app);

  useEffect(() => {

    if (auth.currentUser != null) {
      onValue(messagesRef, (snapshot) => {
        setMessages(snapshot.val())
      })
    }

  }, [isSignedIn])

  const signInWithGoogle = () => {
    setPersistence(auth, browserLocalPersistence).then(() => {
      return signInWithPopup(auth, new GoogleAuthProvider())
        .then((result) => {
          const user = result.user;
          setUserData(user)
          setIsSignedIn(true)
          return;
        }).catch((error) => {
          alert(error.message)
          return;
        });
    })
  }

  const handleClick = () => {
    let messageValue = inputRef.current.value
    let newMessages = [...messages]
    newMessages.push({
      name: auth.currentUser.displayName,
      message: messageValue
    })
    console.log(userData)
    set(messagesRef, newMessages).then(() => {
      inputRef.current.value = ""
    })
  }

  return (
    <div>
      <center>
        <h1>Chat app</h1>
      </center>
      {isSignedIn && (
        <div className='messages'>
          <ul>
            {messages.map((message) => {
              if (auth.currentUser != null) {
                if (message.name == auth.currentUser.displayName) {
                  return (
                    <div className='message bluebubble'>
                      <div className='name'>{message.name}</div>
                      <div className='bubble'>{message.message}</div>
                    </div>
                  )
                } else {
                  return (
                    <div className='message'>
                      <div className='name'>{message.name}</div>
                      <div className='bubble'>{message.message}</div>
                    </div>
                  )
                }
              }
            })}
          </ul>
          <center>
            <div className='sendbox'>
              <input type="text" ref={inputRef} placeholder="Message"></input>
              <button onClick={handleClick}>Send!</button>
            </div>
          </center>
        </div>
      )}
      {!isSignedIn &&
        <center>
          <button class={"signin"} onClick={signInWithGoogle}>Sign in with Google</button>
        </center>
      }
    </div>
  );


}

export default App;