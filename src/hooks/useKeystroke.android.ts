import { ClipboardEvent, ChangeEvent, useCallback, useState, useContext } from "react";

import { Area2Context } from "../context";
import { getBrowserInfo, getOsInfo } from "../utils";
import type { IKeystrokeResult } from "../interfaces";
import { getReducedNeuroprofile } from "../api";

/**
 * Keystroke for android mobile browser
 * @param {string} userUID - The unique identifier of the user for whom the neuroprofile is generated.
 * @param {string} userToken - A token used for authentication or authorization purposes.
 * @returns {Object} - An object containing the text input, input change handler, keydown handler, keyup handler, paste handler, before input handler, key input handler, and getNeuroprofile function.
 */
export const useMobileKeystrokeAndroid = (userUID: string, userToken: string) => {

    const { canAccess, getAndroidKeystrokeManager } = useContext(Area2Context);

    const [isSending, setIsSending] = useState(false);
    const [textInput, setTextInput] = useState("");


    /**
     * Handles the before input event.
     * @param {string} currentValue - The current value of the input before the input event.
     */
    const handleBeforeInput = useCallback((currentValue: string) => {
        if (!canAccess) { return }
        getAndroidKeystrokeManager().processBeforeInput(currentValue, textInput);
    }, [canAccess, textInput]);


    /**
     * Handles the paste event.
     * @param {ClipboardEvent<HTMLInputElement>} event - The paste event.
     */
    const handlePaste = useCallback((event: ClipboardEvent<HTMLInputElement>) => {
        if (!canAccess) { return }
        const pastedText = event.clipboardData.getData("text");
        getAndroidKeystrokeManager().processPaste(pastedText);
    }, [canAccess]);


    /**
     * Handles the input change event
     * @param {ChangeEvent<HTMLInputElement>} event - The input change event
     */
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        if (!canAccess) { return }
        setTextInput(newValue);
    }


    /**
     * Handles the submission of typing data and retrieves the neuroprofile.
     * @returns {Promise<IKeystrokeResult | undefined>} - A promise that resolves to the keystroke result or undefined if the submission is skipped.
     */
    const handleSubmit = useCallback(async (): Promise<IKeystrokeResult | undefined> => {
        if (isSending) return;

        setTextInput("");
        setIsSending(true);

        const typingData = getAndroidKeystrokeManager().endTypingSession();

        if (!typingData.startUnixTime) {
            setIsSending(false);
            return {
                error: 'Empty typing data',
                message: `Empty typing data for session: ${typingData.sessionID}. Skipping...`
            };
        }

        typingData.appContext = `${getOsInfo()} - ${getBrowserInfo()}`;

        if (!userToken || !userUID) {
            getAndroidKeystrokeManager().resetTypingData();
            setIsSending(false);
            return {
                error: 'User credentials not found.',
                message: 'Skipping save...',
            };
        }

        const neuroProfileResp = await getReducedNeuroprofile(userUID, userToken, typingData);

        getAndroidKeystrokeManager().resetTypingData();
        setIsSending(false);

        if (!neuroProfileResp.ok) {
            return {
                error: neuroProfileResp.error,
                message: neuroProfileResp.message
            };
        }

        return { data: neuroProfileResp.neuroprofile! };
    }, [isSending, userToken, userUID]);


    /**
     * Handles the key input event.
     * @param {string} inputContent - The content of the key input.
     */
    const handleKeyInput = useCallback((inputContent: string) => {
        if (!canAccess) { return }
        getAndroidKeystrokeManager().processKeyInput(inputContent);
    }, [canAccess]);


    /**
     * Handles the keydown event.
     * @param {HTMLInputElement} target - The target input element.
     */
    const handleKeydown = useCallback(async (target: HTMLInputElement) => {
        if (!canAccess) { return }
        getAndroidKeystrokeManager().processKeydown(target);
    }, [canAccess]);


    /**
     * Handles the keyup event.
     */
    const handleKeyup = useCallback(() => {
        if (!canAccess) { return }
        getAndroidKeystrokeManager().processKeyup();
    }, [canAccess]);

    return {
        textInput,
        handleInputChange,
        handleKeydown,
        handleKeyup,
        handlePaste,
        handleKeyInput,
        handleBeforeInput,
        getNeuroprofile: handleSubmit
    }

}