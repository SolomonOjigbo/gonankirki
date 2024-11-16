"use client";

import { createContext, useEffect, useReducer, useCallback } from "react";
import { auth, getDbInstance, storage } from "../config/firebase";
import {
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendSignInLinkToEmail
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { SplashScreen } from "components/splash-screen";

const initialAuthState = {
  user: null,
  isInitialized: false,
  isAuthenticated: false,
};

const db = getDbInstance();


const actionCodeSettings = {
  url: 'https://gonankirki-v2.firebaseapp.com/',
  handleCodeInApp: true,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "AUTH_STATE_CHANGED":
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user,
        isInitialized: true,
      };
    default:
      return state;
  }
};

// Helper function to handle error logging
const logError = (error) => console.error("Error:", error);

const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log(`User ${user.email} signed in successfully`);
  } catch (error) {
    logError(error);
  }
};

const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        id: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
      console.log("User record created successfully");
    } else {
      console.log("User signed in successfully");
    }
  } catch (error) {
    logError(error);
  }
};


const createUserWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        id: user.uid,
        email: user.email,
      });
      console.log("User record created successfully");
    } else {
      console.log("User with email already exists");
    }
  } catch (error) {
    logError(error);
  }
};

const signInWithEmailLink = async (email) => {
  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem("emailForSignIn", email);
  } catch (error) {
    logError(error);
  }
};

const logout = () => signOut(auth);

export const AuthContext = createContext({
  ...initialAuthState,
  method: "FIREBASE",
  logout,
  signInWithGoogle,
  signInWithEmail,
  createUserWithEmail,
  signInWithEmailLink,
  db,
  storage,
});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialAuthState);

  const init = useCallback(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch({
          type: "AUTH_STATE_CHANGED",
          payload: {
            isAuthenticated: true,
            user: {
              id: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
            },
          },
        });
      } else {
        dispatch({
          type: "AUTH_STATE_CHANGED",
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    });
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  if (!state.isInitialized) return <SplashScreen />;

  return (
    <AuthContext.Provider
      value={{
        ...state,
        logout,
        signInWithEmail,
        signInWithGoogle,
        method: "FIREBASE",
        createUserWithEmail,
        signInWithEmailLink,
        db,
        storage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
