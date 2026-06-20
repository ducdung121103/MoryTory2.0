import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext(null);
const AuthDispatchContext = createContext(null);

const initialState = {
  user: null, // { id, name, email, picture }
  isLoading: true, // true while checking session
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload, isLoading: false };
    case 'LOGOUT':
      return { user: null, isLoading: false };
    case 'LOADED':
      return { ...state, isLoading: false };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check session on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'same-origin' });
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            dispatch({ type: 'LOGIN', payload: data.user });
            return;
          }
        }
      } catch (e) {
        // Not logged in — fine
      }
      dispatch({ type: 'LOADED' });
    })();
  }, []);

  return (
    <AuthContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}

export function useAuthDispatch() {
  const ctx = useContext(AuthDispatchContext);
  if (!ctx) throw new Error('useAuthDispatch must be inside AuthProvider');
  return ctx;
}