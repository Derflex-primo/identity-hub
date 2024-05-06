"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithRedirect, signOut, onAuthStateChanged, getAuth, User} from "firebase/auth"; 
import { app } from "../firebase";

const auth = getAuth(app);

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  handleSignInWithGoogle: () => Promise<void>;
  handleSignOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      await signInWithRedirect(auth, provider);
    } catch (error: any) {
      alert(error.message ?? "An error occurred during Google sign-in.");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const value = {
    user,
    loading,
    handleSignInWithGoogle,
    handleSignOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div className="flex justify-center items-center h-[100vh]">Please wait.....</div> : children}
    </AuthContext.Provider>
  );
};
