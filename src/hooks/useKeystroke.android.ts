import { ClipboardEvent, ChangeEvent, useCallback, useContext } from "react";
import type { IMobileKeystrokeCollection } from "@area2-ai/a2-node-keystroke-package";

import { Area2Context } from "../context";
import { getBrowserInfo, getOsInfo } from "../utils";

/**
 * Keystroke for android mobile browser
 * @returns {Object} - An object containing the text input, input change handler, keydown handler, keyup handler, paste handler, before input handler, key input handler, and finish typing session function.
 */
export const useMobileKeystrokeAndroid = () => {

    const {
        getAndroidKeystrokeManager,
        androidTextValue,
        setAndroidTextValue
    } = useContext(Area2Context);

    /**
     * Handles the before input event.
     * @param {string} currentValue - The current value of the input before the input event.
     */
    const handleOnBeforeInput = useCallback((currentValue: string) => {
        getAndroidKeystrokeManager().processBeforeInput(currentValue, androidTextValue);
    }, [androidTextValue]);


    /**
     * Handles the paste event.
     * @param {ClipboardEvent<HTMLInputElement>} event - The paste event.
     */
    const handlePaste = useCallback((event: ClipboardEvent<HTMLInputElement>) => {
        const pastedText = event.clipboardData.getData("text");
        getAndroidKeystrokeManager().processPaste(pastedText);
    }, []);


    /**
     * Handles the input change event
     * @param {ChangeEvent<HTMLInputElement>} event - The input change event
     */
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setAndroidTextValue(newValue);
    }


    /**
     * Handles the finish typing session event.
     * @returns {IMobileKeystrokeCollection | { error: string, message: string }} - The typing data or an error message.
     */
    const handleFinishTypingSession = useCallback((): IMobileKeystrokeCollection | { error: string, message: string } => {

        setAndroidTextValue("");

        const typingData = getAndroidKeystrokeManager().endTypingSession();
        getAndroidKeystrokeManager().resetTypingData();

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
     * Handles the key input event.
     * @param {string} inputContent - The content of the key input.
     */
    const handleKeyInput = useCallback((inputContent: string) => {
        getAndroidKeystrokeManager().processKeyInput(inputContent);
    }, []);


    /**
     * Handles the keydown event.
     * @param {HTMLInputElement} target - The target input element.
     */
    const handleKeydown = useCallback(async (target: HTMLInputElement) => {
        getAndroidKeystrokeManager().processKeydown(target);
    }, []);


    /**
     * Handles the keyup event.
     */
    const handleKeyup = useCallback(() => {
        getAndroidKeystrokeManager().processKeyup();
    }, []);

    return {
        value: androidTextValue,
        handleInputChange,
        handleKeydown,
        handleKeyup,
        handlePaste,
        handleKeyInput,
        handleOnBeforeInput,
        handleFinishTypingSession
    }

}