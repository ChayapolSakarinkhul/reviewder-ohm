import React, { useEffect } from "react";
import { auth } from "../Firebase/firebase.jsx";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoogleAuthProvider, signInWithRedirect, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";

import Logo from "../Assets/Logo.png";

const SignIn = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user != null ) {
      navigate("/status");
    }
  }, [user, navigate]);

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider)
      .catch(error => {
        console.error("Error signing in with Google:", error);
        alert(`Error signing in with Google. Please try again later.`);
      });
  };

  const handleSignOut = () => {
    signOut(auth);
  };

  return (
    <nav className="SignIn">
      <img src={Logo} className="LargeLogo" alt="Logo" />
      {user ? (
        <button onClick={handleSignOut} className="GoogleButton" type="button">
          Sign Out
        </button>
      ) : (
        <button onClick={googleSignIn} className="GoogleButton" type="button">
          Sign in with Google
        </button>
      )}
    </nav>
  );
};

export default SignIn;