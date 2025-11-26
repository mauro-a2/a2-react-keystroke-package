import { ClipboardEvent, ChangeEvent, useCallback, useContext } from "react";

import { Area2Context } from "../context";
import { getBrowserInfo, getOsInfo } from "../utils";
import type { A2CapturePayload, IiOSKeystrokeHookTemplate } from "../interfaces";

/**
 * Keystroke for ios mobile browser
 * @param {string} inputValue - The current value of the text input - Needed to detect auto-correct changes.
 */
export const useMobileKeystrokeIOS = (): IiOSKeystrokeHookTemplate<A2CapturePayload> => {

    const { getIosKeystrokeManager } = useContext(Area2Context);

    //! Undefined behavior - Try to load via context - provider
    /**
     * Processes auto-correction based on the current input value.
     * @param {string} inputValue - The current value of the text input.
     */
    // const processAutoCorrection = getIosKeystrokeManager().processAutocorrection;

    /**
     * Handles the before input event.
     * @param {number} value - The length of the content before the input event.
     */
    const handleProcessOnBeforeInput = useCallback((value: number) => {
        getIosKeystrokeManager().setPrevContentLength = value;
    }, []);

    /**
     * Handles the paste event.
     * @param {ClipboardEvent<HTMLInputElement>} event - The paste event.
     */
    const handleProcessPaste = useCallback((event: ClipboardEvent<HTMLInputElement>) => {
        const pastedText = event.clipboardData.getData("text");
        getIosKeystrokeManager().processPaste(pastedText);
    }, []);


    /**
     * Checks for text prediction and processes it.
     * @param {string} newValue - The new value of the text input.
     * @param {string} inputValue - The current value of the text input.
     */
    const checkForPrediction = useCallback((newValue: string, inputValue: string) => {
        const textSnapshot = inputValue; // Before it changes
        getIosKeystrokeManager().processPrediction(newValue, textSnapshot);
    }, []);


    /**
     * Handles the input change event
     * @param {ChangeEvent<HTMLInputElement>} event - The input change event
     * @param {string} inputValue - The current value of the text input
     */
    const handleProcessInputChange = (event: ChangeEvent<HTMLInputElement>, inputValue: string) => {
        const newValue = event.target.value;
        checkForPrediction(newValue, inputValue);
    }


    /**
     * Handles the keydown event.
     * @param {string} keyPressed - The key that was pressed.
     * @param {HTMLInputElement} target - The target input element.
     */
    const handleProcessKeydown = useCallback((keyPressed: string, target: HTMLInputElement) => {
        getIosKeystrokeManager().processKeydown(keyPressed, target);
    }, []);


    /**
     * Handles the keyup event.
     * @param {string} key - The key that was released.
     */
    const handleProcessKeyup = useCallback((keyPressed: string) => {
        getIosKeystrokeManager().processKeyup(keyPressed);
    }, []);

    /**
     * Ends the typing session and returns the typing data.
     * @returns {A2CapturePayload | undefined} - The typing data or undefined if no data.
     */
    const handleEndTypingSession = useCallback((): A2CapturePayload | undefined => {

        const typingData = getIosKeystrokeManager().endTypingSession();
        getIosKeystrokeManager().resetTypingData();

        if (!typingData.startUnixTime) {
            console.warn(`Empty typing data for session: ${typingData.sessionID}. Skipping...`);
            return;
        }

        typingData.appContext = `${getOsInfo()} - ${getBrowserInfo()}`;

        return typingData;
    }, []);

    return {
        // processAutoCorrection,
        handleProcessInputChange,
        handleProcessKeydown,
        handleProcessPaste,
        handleProcessOnBeforeInput,
        handleProcessKeyup,
        handleEndTypingSession
    }

}