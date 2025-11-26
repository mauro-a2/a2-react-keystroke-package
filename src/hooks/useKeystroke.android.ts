import { ClipboardEvent, useCallback, useContext } from "react";

import { Area2Context } from "../context";
import { getBrowserInfo, getOsInfo } from "../utils";
import type { A2CapturePayload, IAndroidKeystrokeHookTemplate } from "../interfaces";

/**
 * Keystroke hook for android mobile browser
 */
export const useMobileKeystrokeAndroid = (): IAndroidKeystrokeHookTemplate<A2CapturePayload> => {

    const { getAndroidKeystrokeManager } = useContext(Area2Context);

    /**
     * Handles the before input event.
     * @param {string} newValue - The new value of the input before the input event.
     * @param {string} inputValue - The current value of the input.
     */
    const handleProcessOnBeforeInput = useCallback((newValue: string, inputValue: string) => {
        getAndroidKeystrokeManager().processBeforeInput(newValue, inputValue);
    }, []);


    /**
     * Handles the paste event.
     * @param {ClipboardEvent<HTMLInputElement>} event - The paste event.
     */
    const handleProcessPaste = useCallback((event: ClipboardEvent<HTMLInputElement>) => {
        const pastedText = event.clipboardData.getData("text");
        getAndroidKeystrokeManager().processPaste(pastedText);
    }, []);


    /**
     * Handles the key input event.
     * @param {string} inputContent - The content of the key input.
     */
    const handleProcessKeyInput = useCallback((inputContent: string) => {
        getAndroidKeystrokeManager().processKeyInput(inputContent);
    }, []);


    /**
     * Handles the keydown event.
     * @param {HTMLInputElement} target - The target input element.
     */
    const handleProcessKeydown = useCallback((target: HTMLInputElement) => {
        getAndroidKeystrokeManager().processKeydown(target);
    }, []);


    /**
     * Handles the keyup event.
     */
    const handleProcessKeyup = useCallback(() => {
        getAndroidKeystrokeManager().processKeyup();
    }, []);


    /**
     * Ends the typing session and returns the typing data.
     * @returns {A2CapturePayload | undefined} - The typing data or undefined if no data.
     */
    const handleEndTypingSession = useCallback((): A2CapturePayload | undefined => {

        const typingData = getAndroidKeystrokeManager().endTypingSession();
        getAndroidKeystrokeManager().resetTypingData();

        if (!typingData.startUnixTime) {
            console.warn(`Empty typing data for session: ${typingData.sessionID}. Skipping...`);
            return;
        }

        typingData.appContext = `${getOsInfo()} - ${getBrowserInfo()}`;

        return typingData;
    }, []);

    return {
        handleProcessOnBeforeInput,
        handleProcessPaste,
        handleProcessKeyInput,
        handleProcessKeydown,
        handleProcessKeyup,
        handleEndTypingSession,
    }

}