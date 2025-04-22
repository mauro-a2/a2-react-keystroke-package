import { ChangeEvent, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { IKeystrokeCollection } from "@area2-ai/a2-node-keystroke-package";

import { Area2Context } from "../context";
import { getBrowserInfo, getOsInfo } from "../utils";
import { getReducedNeuroprofile } from "../api";
import type { A2ActionTypes, IKeystrokeResult } from "../interfaces";

/**
 * Keystroke for desktop browsers
 * @returns {Object} - An object containing the text input, input change handler, keydown handler, keyup handler, typing session status, and getNeuroprofile function.
 */
export const useKeystroke = () => {

    const {
        canAccess,
        getKeystrokeManager,
        desktopTextValue,
        setDesktopTextValue
    } = useContext(Area2Context);

    const [isSending, setIsSending] = useState(false);
    const temporalTypingDataRef = useRef<IKeystrokeCollection | null>(null);
    const userTokenRef = useRef('');
    const userUIDRef = useRef('');

    const getIsTypingSessionActive = () => getKeystrokeManager().getIsTypingSessionActive;

    const promptAccessWarning = () => {
        console.warn('You are not authorized to use the hook.');
        console.log('Make sure to provide a valid access key.');
    }

    /**
     * Handles the typing session when a submission is already in progress.
     * This function clears the desktop text value, updates the user credentials,
     * and processes the current typing session data by ending the session and resetting it.
     * 
     * @param {string} userUID - The unique identifier of the user.
     * @param {string} userToken - A token used for authentication or authorization purposes.
     */
    const handleTypingSessionWhileSending = (userUID: string, userToken: string) => {
        setDesktopTextValue("");
        userTokenRef.current = userToken;
        userUIDRef.current = userUID;

        if (temporalTypingDataRef.current === null) {
            temporalTypingDataRef.current = getKeystrokeManager().endTypingSession();
            temporalTypingDataRef.current.appContext = `${getOsInfo()} - ${getBrowserInfo()}`;
        }

        getKeystrokeManager().resetTypingData();
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
            'Desktop',
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
     * Handles the input change event
     * @param {ChangeEvent<HTMLInputElement>} event - The input change event
     */
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (!canAccess) {
            promptAccessWarning();
            return;
        }
        const newValue = event.target.value;
        getKeystrokeManager().processInputChange(newValue);
        setDesktopTextValue(newValue);
    };

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

        setDesktopTextValue("");
        setIsSending(true);

        const typingData = getKeystrokeManager().endTypingSession();
        getKeystrokeManager().resetTypingData();

        if (!typingData.startUnixTime) {
            console.log(`Empty typing data for session: ${typingData.sessionID}. Skipping...`);
            setIsSending(false);
            return {
                error: 'Empty typing data',
                message: `Empty typing data for session: ${typingData.sessionID}. Skipping...`
            };
        }

        typingData.appContext = `${getOsInfo()} - ${getBrowserInfo()}`;

        if (!userToken || !userUID) {
            console.warn("User credentials not found. Skipping save... ");
            getKeystrokeManager().resetTypingData();
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
            'Desktop',
            action ?? 'default'
        );

        setIsSending(false);

        if (!neuroProfileResp.ok) {
            console.warn(`${neuroProfileResp.message}`);
            console.error(`${neuroProfileResp.error}`);
            return {
                error: neuroProfileResp.error,
                message: neuroProfileResp.message
            };
        }

        return { data: neuroProfileResp.neuroprofile! };
    }, [isSending]);

    /**
     * Handles the keydown event.
     * @param {string} key - The key that was pressed.
     */
    const handleKeydown = useCallback((key: string) => {
        if (!canAccess) {
            promptAccessWarning();
            return;
        }
        getKeystrokeManager().processKeydown(key);
    }, [canAccess]);

    /**
     * Handles the keyup event.
     * @param {string} key - The key that was released.
     */
    const handleKeyup = useCallback((key: string) => {
        if (!canAccess) {
            promptAccessWarning();
            return;
        }
        getKeystrokeManager().processKeyup(key);
    }, [canAccess]);

    return {
        value: desktopTextValue,
        handleInputChange,
        handleKeydown,
        handleKeyup,
        getIsTypingSessionActive,
        getNeuroprofile: handleSubmit
    };
};
