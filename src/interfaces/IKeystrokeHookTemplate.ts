import { ChangeEvent, ClipboardEvent } from "react";

export type TargetPlatform = 'desktop' | 'ios' | 'android';

export interface IErrorMessage {
    error: string;
    message: string;
}

//* Common interface for keystroke hook templates
export interface IKeystrokeHookTemplate<T> {
    A2CapturePayload: T | null;
    handleProcessInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
    handleEndTypingSession: () => T | IErrorMessage;
}

//* Common interface for mobile keystroke hook template
export interface IMobileKeystrokeHookTemplate<T> extends IKeystrokeHookTemplate<T> {
    handleProcessPaste: (event: ClipboardEvent<HTMLInputElement>) => void;
    handleProcessOnBeforeInput: (newValue: string, inputValue: string) => void;
    handleProcessKeydown: (target: HTMLInputElement) => void;
    handleProcessKeyup: () => void;
}

//* Interface for desktop keystroke hook
export interface IDesktopKeystrokeHookTemplate<T> extends IKeystrokeHookTemplate<T> {
    isTypingSessionActive: boolean;
    handleProcessKeydown: (key: string) => void;
    handleProcessKeyup: (key: string) => void;
}

//* Interface for android keystroke hook
export interface IAndroidKeystrokeHookTemplate<T> extends IMobileKeystrokeHookTemplate<T> {
    handleProcessKeyInput: (inputContent: string) => void;
}