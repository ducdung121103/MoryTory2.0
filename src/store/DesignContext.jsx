import { createContext, useReducer, useContext, useEffect } from 'react';
import { initialState, designReducer } from './designReducer';
import { saveDraft } from './draftService';

const DesignContext = createContext(null);
const DesignDispatchContext = createContext(null);

export function DesignProvider({ children }) {
  const [state, dispatch] = useReducer(designReducer, initialState);

  // Auto-save draft when state changes
  useEffect(() => {
    // We only save if there is at least a photo uploaded
    if (state.photo) {
      saveDraft(state);
    }
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
