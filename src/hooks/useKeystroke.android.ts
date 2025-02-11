import { ClipboardEvent, ChangeEvent, useCallback, useState, useContext } from "react";

import { Area2Context } from "../context";
import { getBrowserInfo, getOsInfo } from "../utils";
import type { A2ActionTypes, IKeystrokeResult } from "../interfaces";
import { getReducedNeuroprofile } from "../api";

/**
 * Keystroke for android mobile browser
 * @returns {Object} - An object containing the text input, input change handler, keydown handler, keyup handler, paste handler, before input handler, key input handler, and getNeuroprofile function.
 */
export const useMobileKeystrokeAndroid = () => {

    const {
        canAccess,
        getAndroidKeystrokeManager,
        androidTextValue,
        setAndroidTextValue
    } = useContext(Area2Context);

    const [isSending, setIsSending] = useState(false);


    /**
     * Handles the before input event.
     * @param {string} currentValue - The current value of the input before the input event.
     */
    const handleOnBeforeInput = useCallback((currentValue: string) => {
        if (!canAccess) { return }
        getAndroidKeystrokeManager().processBeforeInput(currentValue, androidTextValue);
    }, [canAccess, androidTextValue]);


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
        setAndroidTextValue(newValue);
    }


    /**
     * Handles the submission of typing data and retrieves the neuroprofile.
     * @param {string} userUID - The unique identifier of the user for whom the neuroprofile is generated.
     * @param {string} userToken - A token used for authentication or authorization purposes.
     * @param {'default' | 'compare' | 'summary' | 'trends'} [action] - Optional action that determines the type of response to be received from the server.
     * @returns {Promise<IKeystrokeResult | undefined>} - A promise that resolves to the keystroke result or undefined if the submission is skipped.
     */
    const handleSubmit = useCallback(async (userUID: string, userToken: string, action?: A2ActionTypes): Promise<IKeystrokeResult | undefined> => {
        if (isSending) return;

        setAndroidTextValue("");
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

        const neuroProfileResp = await getReducedNeuroprofile(
            userUID,
            userToken,
            typingData,
            'Mobile',
            action ?? 'default'
        );

        getAndroidKeystrokeManager().resetTypingData();
        setIsSending(false);

        if (!neuroProfileResp.ok) {
            return {
                error: neuroProfileResp.error,
                message: neuroProfileResp.message
            };
        }

        return { data: neuroProfileResp.neuroprofile! };
    }, [isSending]);


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
        value: androidTextValue,
        handleInputChange,
        handleKeydown,
        handleKeyup,
        handlePaste,
        handleKeyInput,
        handleOnBeforeInput,
        getNeuroprofile: handleSubmit
    }

}