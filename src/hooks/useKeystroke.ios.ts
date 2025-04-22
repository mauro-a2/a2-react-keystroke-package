import { ClipboardEvent, ChangeEvent, useCallback, useEffect, useState, useContext, useRef } from "react";
import type { IMobileKeystrokeCollection } from "@area2-ai/a2-node-keystroke-package";

import { Area2Context } from "../context";
import { getBrowserInfo, getOsInfo } from "../utils";
import { getReducedNeuroprofile } from "../api";
import type { A2ActionTypes, IKeystrokeResult } from "../interfaces";

/**
 * Keystroke for ios mobile browser
 * @returns {Object} - An object containing the text input, input change handler, keydown handler, keyup handler, paste handler, before input handler, typing session status, and getNeuroprofile function.
 */
export const useMobileKeystrokeIOS = () => {

    const {
        canAccess,
        getIosKeystrokeManager,
        iOSTextValue,
        setIOSTextValue
    } = useContext(Area2Context);

    const [isSending, setIsSending] = useState(false);
    const temporalTypingDataRef = useRef<IMobileKeystrokeCollection | null>(null);
    const userTokenRef = useRef('');
    const userUIDRef = useRef('');

    /**
     * Handles the typing session when a submission is already in progress.
     * This function clears the desktop text value, updates the user credentials,
     * and processes the current typing session data by ending the session and resetting it.
     * 
     * @param {string} userUID - The unique identifier of the user.
     * @param {string} userToken - A token used for authentication or authorization purposes.
     */
    const handleTypingSessionWhileSending = (userUID: string, userToken: string) => {
        setIOSTextValue("");
        userTokenRef.current = userToken;
        userUIDRef.current = userUID;

        if (temporalTypingDataRef.current === null) {
            temporalTypingDataRef.current = getIosKeystrokeManager().endTypingSession();
            temporalTypingDataRef.current.appContext = `${getOsInfo()} - ${getBrowserInfo()}`;
        }

        getIosKeystrokeManager().resetTypingData();
    }

    /**
     * This function sends the first typing session that was detected while waiting for a reply to the previous call to the server.
     * Its purpose is to keep the typing metrics on the server up to date.
     */
    const updateTypingSession = () => {
        if (!temporalTypingDataRef.current) { return }
        getReducedNeuroprofile(
            userUIDRef.current,
            userTokenRef.current,
            temporalTypingDataRef.current,
            'Mobile',
            "default"
        );
        temporalTypingDataRef.current = null;
    }

    useEffect(() => {
        if (!isSending) {
            updateTypingSession();
        }
    }, [isSending]);

    /**
     * Handles the before input event.
     * @param {number} value - The length of the content before the input event.
     */
    const handleOnBeforeInput = useCallback((value: number) => {
        if (!canAccess) { return }
        getIosKeystrokeManager().setPrevContentLength = value;
    }, [canAccess]);

    /**
     * Handles the paste event.
     * @param {ClipboardEvent<HTMLInputElement>} event - The paste event.
     */
    const handlePaste = useCallback((event: ClipboardEvent<HTMLInputElement>) => {
        if (!canAccess) { return }
        const pastedText = event.clipboardData.getData("text");
        getIosKeystrokeManager().processPaste(pastedText);
    }, [canAccess]);

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
        if (!canAccess) { return }
        getIosKeystrokeManager().processPrediction(newValue, textSnapshot);
    }, [canAccess, iOSTextValue]);


    /**
     * Handles the input change event
     * @param {ChangeEvent<HTMLInputElement>} event - The input change event
     */
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        if (!canAccess) { return }
        checkForPrediction(newValue);
        setIOSTextValue(newValue);
    }


    /**
     * Handles the submission of typing data and retrieves the neuroprofile.
     * @param {string} userUID - The unique identifier of the user for whom the neuroprofile is generated.
     * @param {string} userToken - A token used for authentication or authorization purposes.
     * @param {'default' | 'compare' | 'summary' | 'trends'} [action] - Optional action that determines the type of response to be received from the server.
     * @returns {Promise<IKeystrokeResult | undefined>} - A promise that resolves to the keystroke result or undefined if the submission is skipped.
     */
    const handleSubmit = useCallback(async (userUID: string, userToken: string, action?: A2ActionTypes): Promise<IKeystrokeResult | undefined> => {
        if (isSending) {
            handleTypingSessionWhileSending(userUID, userToken);
            return;
        }

        setIOSTextValue("");
        setIsSending(true);

        const typingData = getIosKeystrokeManager().endTypingSession();
        getIosKeystrokeManager().resetTypingData();

        if (!typingData.startUnixTime) {
            setIsSending(false);
            return {
                error: 'Empty typing data',
                message: `Empty typing data for session: ${typingData.sessionID}. Skipping...`
            };
        }

        typingData.appContext = `${getOsInfo()} - ${getBrowserInfo()}`;

        if (!userToken || !userUID) {
            getIosKeystrokeManager().resetTypingData();
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
     * Handles the keydown event.
     * @param {string} keyPressed - The key that was pressed.
     * @param {HTMLInputElement} target - The target input element.
     */
    const handleKeydown = useCallback((keyPressed: string, target: HTMLInputElement) => {
        if (!canAccess) { return }
        getIosKeystrokeManager().processKeydown(keyPressed, target);
    }, [canAccess]);


    /**
     * Handles the keyup event.
     * @param {string} key - The key that was released.
     */
    const handleKeyup = useCallback((keyPressed: string) => {
        if (!canAccess) { return }
        getIosKeystrokeManager().processKeyup(keyPressed);
    }, [canAccess]);

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
        getNeuroprofile: handleSubmit
    }

}