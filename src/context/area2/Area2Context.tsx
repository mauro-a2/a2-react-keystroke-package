import { createContext } from 'react';
import type {
    KeystrokeManager,
    AndroidKeystrokeManager,
    IosKeystrokeManager
} from '@area2-ai/a2-node-keystroke-package';

interface ContextProps {
    desktopTextValue: string;
    iOSTextValue: string;
    androidTextValue: string;

    //Methods
    getKeystrokeManager: () => KeystrokeManager;
    getAndroidKeystrokeManager: () => AndroidKeystrokeManager;
    getIosKeystrokeManager: () => IosKeystrokeManager;
    setDesktopTextValue: (value: string) => void;
    setIOSTextValue: (value: string) => void;
    setAndroidTextValue: (value: string) => void;
}

export const Area2Context = createContext({} as ContextProps);