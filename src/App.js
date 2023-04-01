import logo from './logo.svg';
import './App.css';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from "firebase/database"
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { useEffect, useState, useRef } from 'react';

const apiKey = process.env.API_KEY;
const apikey = "AIzaSyCQ3CIsOYfCs_UgPYz45iX5nt6Rqb6-Xuo"

const firebaseConfig = {
  apiKey: apikey,
  authDomain: "chat-app-58284.firebaseapp.com",
  databaseURL: "https://chat-app-58284-default-rtdb.firebaseio.com",
  projectId: "chat-app-58284",
  storageBucket: "chat-app-58284.appspot.com",
  messagingSenderId: "141649007276",
  appId: "1:141649007276:web:da71ab3443c0df223a4509",
  measurementId: "G-5WLSE2TR71"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const messagesRef = ref(database, 'messages');


function App() {

  const [messages, setMessages] = useState([]);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userData, setUserData] = useState([]);

  const auth = getAuth(app);

  useEffect(()=>{
    if(auth.currentUser != null){
      onValue(messagesRef, (snapshot) =>{
        setMessages(snapshot.val())
      })
    }
  },[isSignedIn]) 

  const signInWithGoogle = () => {
    signInWithPopup(auth, new GoogleAuthProvider())
      .then((result)=>{
        const user = result.user
        setUserData(user)
        setIsSignedIn(true)

      }).catch((error) => {
        console.log(error.message)
      });
  }

  return (
    <div className="App">
        <h1>chat app</h1>
        {isSignedIn && <h2>Welcome {userData.displayName}!</h2>}
        {!isSignedIn && <h2>You are not signed in!</h2>}
        <button onClick = {signInWithGoogle}> Sign in with Google</button>
    </div>
  );
}

export default App;
