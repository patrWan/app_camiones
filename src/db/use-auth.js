import React, { useState, useEffect, useContext, createContext } from "react";
import { auth } from "./firebase";
import { useHistory } from "react-router-dom";
// Add your Firebase credentials

const authContext = createContext();

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return useContext(authContext);
};

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState(null);
  let history = useHistory();
  // Wrap any Firebase methods we want to use making sure ...
  // ... to save the user to state.
  const signin = (email, password) => {
    return auth.signInWithEmailAndPassword(email, password).then((response) => {
      auth.currentUser
        .getIdTokenResult()
        .then((idTokenResult) => {
          // Confirm the user is an Admin.
          if (!!idTokenResult.claims.admin) {
            // Show admin UI.
            console.log("SOY ADMIN")
            localStorage.setItem("user", response.user);
            localStorage.setItem("isAdmin", true)
            history.push("/admin/home");
          } else {
            // Show regular user UI.
            console.log("NO SOY ADMIN")
            localStorage.setItem("user", response.user);
            localStorage.setItem("isAdmin", false)
            history.push("/conductor/home");
          }
        })
        .catch((error) => {
          console.log(error);
        });

      localStorage.setItem("user", response.user);
      setUser(response.user);
      return response.user;
    });
  };

  const signup = (email, password) => {
    return auth
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        setUser(response.user);
        return response.user;
      });
  };

  const signout = () => {
    return auth.signOut().then(() => {
        console.log("!!! Sesión Cerrada");
        history.push("/")
    });
  };

  const sendPasswordResetEmail = (email) => {
    return auth.sendPasswordResetEmail(email).then(() => {
      return true;
    });
  };

  const confirmPasswordReset = (code, password) => {
    return auth.confirmPasswordReset(code, password).then(() => {
      return true;
    });
  };

  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any ...
  // ... component that utilizes this hook to re-render with the ...
  // ... latest auth object.
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Return the user object and auth methods
  return {
    user,
    signin,
    signup,
    signout,
    sendPasswordResetEmail,
    confirmPasswordReset,
  };
}
