import { ClipboardEvent, ChangeEvent, useCallback, useEffect, useContext } from "react";
import type { IMobileKeystrokeCollection } from "@area2-ai/a2-node-keystroke-package";

import { Area2Context } from "../context";
import { getBrowserInfo, getOsInfo } from "../utils";

/**
 * Keystroke for ios mobile browser
 * @returns {Object} - An object containing the text input, input change handler, keydown handler, keyup handler, paste handler, before input handler, typing session status, and finish typing session handler.
 */
export const useMobileKeystrokeIOS = () => {

    const {
        getIosKeystrokeManager,
        iOSTextValue,
        setIOSTextValue
    } = useContext(Area2Context);


    /**
     * Handles the before input event.
     * @param {number} value - The length of the content before the input event.
     */
    const handleOnBeforeInput = useCallback((value: number) => {
        getIosKeystrokeManager().setPrevContentLength = value;
    }, []);

    /**
     * Handles the paste event.
     * @param {ClipboardEvent<HTMLInputElement>} event - The paste event.
     */
    const handlePaste = useCallback((event: ClipboardEvent<HTMLInputElement>) => {
        const pastedText = event.clipboardData.getData("text");
        getIosKeystrokeManager().processPaste(pastedText);
    }, []);

    const processAutocorrection = () => {
        if (!getIosKeystrokeManager()) { return }
        getIosKeystrokeManager().processAutocorrection(iOSTextValue);
    }


    /**
     * Checks for text prediction and processes it.
     * @param {string} newValue - The new value of the text input.
     */
    const checkForPrediction = useCallback((newValue: string) => {
        const textSnapshot = iOSTextValue; // Before it changes
        getIosKeystrokeManager().processPrediction(newValue, textSnapshot);
    }, [iOSTextValue]);


    /**
     * Handles the input change event
     * @param {ChangeEvent<HTMLInputElement>} event - The input change event
     */
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        checkForPrediction(newValue);
        setIOSTextValue(newValue);
    }


    /**
     * Handles the finish typing session event.
     * @returns {IMobileKeystrokeCollection | { error: string, message: string }} - The typing data or an error message.
     */
    const handleFinishTypingSession = useCallback((): IMobileKeystrokeCollection | { error: string, message: string } => {

        setIOSTextValue("");

        const typingData = getIosKeystrokeManager().endTypingSession();
        getIosKeystrokeManager().resetTypingData();

        if (!typingData.startUnixTime) {
            return {
                error: 'Empty typing data',
                message: `Empty typing data for session: ${typingData.sessionID}. Skipping...`
            };
        }

        typingData.appContext = `${getOsInfo()} - ${getBrowserInfo()}`;

        return typingData;
    }, []);

    /**
     * Handles the keydown event.
     * @param {string} keyPressed - The key that was pressed.
     * @param {HTMLInputElement} target - The target input element.
     */
    const handleKeydown = useCallback((keyPressed: string, target: HTMLInputElement) => {
        getIosKeystrokeManager().processKeydown(keyPressed, target);
    }, []);


    /**
     * Handles the keyup event.
     * @param {string} key - The key that was released.
     */
    const handleKeyup = useCallback((keyPressed: string) => {
        getIosKeystrokeManager().processKeyup(keyPressed);
    }, []);

    useEffect(() => {
        processAutocorrection();
    }, [iOSTextValue]);

    return {
        value: iOSTextValue,
        handleInputChange,
        handleKeydown,
        handleKeyup,
        handlePaste,
        handleOnBeforeInput,
        handleFinishTypingSession
    }

}