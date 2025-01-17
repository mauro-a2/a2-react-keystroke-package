import { createContext } from 'react';

interface ContextProps {
    canAccess:  boolean;
}

export const Area2Context = createContext({} as ContextProps);