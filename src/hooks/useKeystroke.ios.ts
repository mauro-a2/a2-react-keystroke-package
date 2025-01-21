import { ClipboardEvent, ChangeEvent, useCallback, useEffect, useState, useRef, useContext } from "react";
import { IosKeystrokeManager } from "@area2-ai/a2-node-keystroke-package";

import { Area2Context } from "../context";
import { getBrowserInfo, getOsInfo } from "../utils";
import { getReducedNeuroprofile } from "../api";
import type { IKeystrokeResult } from "../interfaces";

/**
 * Keystroke for ios mobile browser
 * @param {string} userUID - The unique identifier of the user for whom the neuroprofile is generated.
 * @param {string} userToken - A token used for authentication or authorization purposes.
 * @returns {Object} - An object containing the text input, input change handler, keydown handler, keyup handler, paste handler, before input handler, typing session status, and getNeuroprofile function.
 */
export const useMobileKeystrokeIOS = (userUID: string, userToken: string) => {

    const keystrokeManagerRef = useRef(new IosKeystrokeManager());

    const { canAccess } = useContext(Area2Context);

    const [textInput, setTextInput] = useState("");
    const [isSending, setIsSending] = useState(false);

    /**
     * Handles the before input event.
     * @param {number} value - The length of the content before the input event.
     */
    const handleOnBeforeInput = useCallback((value: number) => {
        if (!canAccess) { return }
        keystrokeManagerRef.current.setPrevContentLength = value;
    }, [canAccess]);

    /**
     * Handles the paste event.
     * @param {ClipboardEvent<HTMLInputElement>} event - The paste event.
     */
    const handlePaste = useCallback((event: ClipboardEvent<HTMLInputElement>) => {
        if (!canAccess) { return }
        const pastedText = event.clipboardData.getData("text");
        keystrokeManagerRef.current.processPaste(pastedText);
    }, [canAccess]);

    useEffect(() => {
        keystrokeManagerRef.current.processAutocorrection(textInput);
    }, [textInput]);


    /**
     * Checks for text prediction and processes it.
     * @param {string} newValue - The new value of the text input.
     */
    const checkForPrediction = useCallback((newValue: string) => {
        const textSnapshot = textInput; // Before it changes
        if (!canAccess) { return }
        keystrokeManagerRef.current.processPrediction(newValue, textSnapshot);
    }, [canAccess, textInput]);


    /**
     * Handles the input change event
     * @param {ChangeEvent<HTMLInputElement>} event - The input change event
     */
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        if (!canAccess) { return }
        checkForPrediction(newValue);
        setTextInput(newValue);
    }


    /**
     * Handles the submission of typing data and retrieves the neuroprofile.
     * @returns {Promise<IKeystrokeResult | undefined>} - A promise that resolves to the keystroke result or undefined if the submission is skipped.
     */
    const handleSubmit = useCallback(async (): Promise<IKeystrokeResult | undefined> => {
        if (isSending) return;

        setIsSending(true);

        const typingData = keystrokeManagerRef.current.endTypingSession();

        if (!typingData.startUnixTime) {
            setIsSending(false);
            return {
                error: 'Empty typing data',
                message: `Empty typing data for session: ${typingData.sessionID}. Skipping...`
            };
        }

        typingData.appContext = `${getOsInfo()} - ${getBrowserInfo()}`;

        if (!userToken || !userUID) {
            keystrokeManagerRef.current.resetTypingData();
            setTextInput("");
            setIsSending(false);
            return {
                error: 'User credentials not found.',
                message: 'Skipping save...',
            };
        }

        const neuroProfileResp = await getReducedNeuroprofile(userUID, userToken, typingData);

        keystrokeManagerRef.current.resetTypingData();
        setTextInput("");
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
     * Handles the keydown event.
     * @param {string} keyPressed - The key that was pressed.
     * @param {HTMLInputElement} target - The target input element.
     */
    const handleKeydown = useCallback((keyPressed: string, target: HTMLInputElement) => {
        if (!canAccess) { return }
        keystrokeManagerRef.current.processKeydown(keyPressed, target);
    }, [canAccess]);


    /**
     * Handles the keyup event.
     * @param {string} key - The key that was released.
     */
    const handleKeyup = useCallback((keyPressed: string) => {
        if (!canAccess) { return }
        keystrokeManagerRef.current.processKeyup(keyPressed);
    }, [canAccess]);

    return {
        textInput,
        handleInputChange,
        handleKeydown,
        handleKeyup,
        handlePaste,
        handleOnBeforeInput,
        isTypingSessionActive: keystrokeManagerRef.current.getIsTypingSessionActive,
        getNeuroprofile: handleSubmit
    }

}