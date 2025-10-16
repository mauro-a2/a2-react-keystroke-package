import { ChangeEvent, ClipboardEvent } from "react";

export type TargetPlatform = 'desktop' | 'ios' | 'android';

export interface IErrorMessage {
    error: string;
    message: string;
}

//* Common interface for keystroke hook templates
export interface IKeystrokeHookTemplate<T> {
    A2CapturePayload: T | null;
    handleEndTypingSession: () => T | IErrorMessage;
}

//* Common interface for mobile keystroke hook template
export interface IMobileKeystrokeHookTemplate<T> extends IKeystrokeHookTemplate<T> {
    handleProcessPaste: (event: ClipboardEvent<HTMLInputElement>) => void;
}

//? Interface for desktop keystroke hook
export interface IDesktopKeystrokeHookTemplate<T> extends IKeystrokeHookTemplate<T> {
    getIsTypingSessionActive: () => boolean;
    handleProcessInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
    handleProcessKeydown: (key: string) => void;
    handleProcessKeyup: (key: string) => void;
}

//? Interface for android keystroke hook
export interface IAndroidKeystrokeHookTemplate<T> extends IMobileKeystrokeHookTemplate<T> {
    handleProcessKeydown: (target: HTMLInputElement) => void;
    handleProcessKeyInput: (inputContent: string) => void;
    handleProcessKeyup: () => void;
    handleProcessOnBeforeInput: (newValue: string, inputValue: string) => void;
}

//? Interface for iOS keystroke hook
export interface IiOSKeystrokeHookTemplate<T> extends IMobileKeystrokeHookTemplate<T> {
    handleProcessInputChange: (event: ChangeEvent<HTMLInputElement>, inputValue: string) => void;
    handleProcessKeydown: (keyPressed: string, target: HTMLInputElement) => void;
    handleProcessKeyup: (keyPressed: string) => void;
    handleProcessOnBeforeInput: (value: number) => void;
    //! processAutoCorrection: (textInputValue: string) => void;
}