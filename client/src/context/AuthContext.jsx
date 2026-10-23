import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut 
} from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('college_event_user');
      const savedToken = localStorage.getItem('college_event_token');
      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      }
    } catch (e) {
      console.error('Failed to restore auth session:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync user profile with backend and store token
  const syncWithBackend = async (userData) => {
    const res = await fetch('/api/auth/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to sync user profile');
    }

    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('college_event_user', JSON.stringify(data.user));
    localStorage.setItem('college_event_token', data.token);
    return data.user;
  };

  // Login handler (Firebase Auth or Demo mode)
  const login = async (email, password) => {
    const cleanEmail = email.toLowerCase().trim();
    
    // If Firebase is configured and ready, authenticate with Firebase
    if (auth && auth.app) {
      try {
        const userCred = await signInWithEmailAndPassword(auth, cleanEmail, password);
        const fbUser = userCred.user;
        return await syncWithBackend({
          uid: fbUser.uid,
          name: fbUser.displayName || cleanEmail.split('@')[0],
          email: cleanEmail
        });
      } catch (fbErr) {
        console.warn('Firebase login attempt fallback to local auth:', fbErr.message);
      }
    }

    // Default fast-track authentication via backend
    const res = await fetch('/api/auth/demo-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed. Please check your credentials.');
    }

    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('college_event_user', JSON.stringify(data.user));
    localStorage.setItem('college_event_token', data.token);
    return data.user;
  };

  // Signup handler (Student or Admin)
  const signup = async (name, email, password, role = 'student') => {
    const cleanEmail = email.toLowerCase().trim();

    // If Firebase Auth is configured
    if (auth && auth.app) {
      try {
        const userCred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        return await syncWithBackend({
          uid: userCred.user.uid,
          name,
          email: cleanEmail,
          role
        });
      } catch (fbErr) {
        console.warn('Firebase signup fallback to local backend:', fbErr.message);
      }
    }

    // Direct backend registration
    return await syncWithBackend({
      name,
      email: cleanEmail,
      role
    });
  };

  // Quick One-Click Demo Login
  const quickDemoLogin = async (role = 'student') => {
    const email = role === 'admin' ? 'admin@college.edu' : 'alex.smith@college.edu';
    return await login(email, 'demo123');
  };

  // Logout
  const logout = async () => {
    if (auth) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {}
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('college_event_user');
    localStorage.removeItem('college_event_token');
  };

  const value = {
    user,
    token,
    loading,
    isAdmin: user?.role === 'admin',
    isStudent: user?.role === 'student',
    isAuthenticated: !!user,
    login,
    signup,
    quickDemoLogin,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
