import { ClipboardEvent, useCallback, useContext, useRef } from "react";
import type { IMobileKeystrokeCollection } from "@area2-ai/a2-node-keystroke-package";

import { Area2Context } from "../context";
import { getBrowserInfo, getOsInfo } from "../utils";
import type { IAndroidKeystrokeHookTemplate, IErrorMessage } from "../interfaces";

/**
 * Keystroke hook for android mobile browser
 */
export const useMobileKeystrokeAndroid = (): IAndroidKeystrokeHookTemplate<IMobileKeystrokeCollection> => {

    const typingSessionRef = useRef<IMobileKeystrokeCollection | null>(null);

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
     * Ends the typing session and generates/returns the typing data.
     * @returns {IMobileKeystrokeCollection | IErrorMessage} - The typing data or an error message.
     */
    const handleEndTypingSession = useCallback((): IMobileKeystrokeCollection | IErrorMessage => {

        const typingData = getAndroidKeystrokeManager().endTypingSession();
        getAndroidKeystrokeManager().resetTypingData();

        if (!typingData.startUnixTime) {
            return {
                error: 'Empty typing data',
                message: `Empty typing data for session: ${typingData.sessionID}. Skipping...`
            };
        }

        typingData.appContext = `${getOsInfo()} - ${getBrowserInfo()}`;

        typingSessionRef.current = typingData;
        return typingData;
    }, []);

    return {
        A2CapturePayload: typingSessionRef.current,
        handleProcessOnBeforeInput,
        handleProcessPaste,
        handleProcessKeyInput,
        handleProcessKeydown,
        handleProcessKeyup,
        handleEndTypingSession,
    }

}