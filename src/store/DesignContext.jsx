import { createContext, useReducer, useContext, useEffect, useRef } from 'react';
import { initialState, designReducer } from './designReducer';
import { saveDraft } from './draftService';

const DesignContext = createContext(null);
const DesignDispatchContext = createContext(null);

export function DesignProvider({ children }) {
  const [state, dispatch] = useReducer(designReducer, initialState);
  const timerRef = useRef(null);

  // Auto-save draft with 500ms debounce
  useEffect(() => {
    if (!state.photo) return;

    // Clear previous timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set new debounced save
    timerRef.current = setTimeout(() => {
      saveDraft(state);
    }, 500);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [state]);

  return (
    <DesignContext.Provider value={state}>
      <DesignDispatchContext.Provider value={dispatch}>
        {children}
      </DesignDispatchContext.Provider>
    </DesignContext.Provider>
  );
}

export function useDesign() {
  return useContext(DesignContext);
}

export function useDesignDispatch() {
  return useContext(DesignDispatchContext);
}