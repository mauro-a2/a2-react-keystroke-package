import { createContext } from 'react';
import type { KeystrokeManager } from '@area2-ai/a2-node-keystroke-package';

interface ContextProps {
    canAccess: boolean;

    //Methods
    getKeystrokeManager: () => KeystrokeManager;
}

export const Area2Context = createContext({} as ContextProps);