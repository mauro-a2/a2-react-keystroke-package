import { createContext } from 'react';
import type {
    KeystrokeManager,
    AndroidKeystrokeManager,
    IosKeystrokeManager
} from '@area2-ai/a2-node-keystroke-package';

interface ContextProps {
    getKeystrokeManager: () => KeystrokeManager;
    getAndroidKeystrokeManager: () => AndroidKeystrokeManager;
    getIosKeystrokeManager: () => IosKeystrokeManager;
}

export const Area2Context = createContext({} as ContextProps);