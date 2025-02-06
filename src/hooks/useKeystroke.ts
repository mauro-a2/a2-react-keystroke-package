import { ChangeEvent, useCallback, useContext, useState } from "react";

import { Area2Context } from "../context";
import { getBrowserInfo, getOsInfo } from "../utils";
import { getReducedNeuroprofile } from "../api";
import type { IKeystrokeResult } from "../interfaces";

/**
 * Keystroke for desktop browsers
 * @param {string} userUID - The unique identifier of the user for whom the neuroprofile is generated.
 * @param {string} userToken - A token used for authentication or authorization purposes.
 * @returns {Object} - An object containing the text input, input change handler, keydown handler, keyup handler, typing session status, and getNeuroprofile function.
 */
export const useKeystroke = (userUID: string, userToken: string) => {

    const {
        canAccess,
        getKeystrokeManager,
        desktopTextValue,
        setDesktopTextValue
    } = useContext(Area2Context);

    const [isSending, setIsSending] = useState(false);

    const getIsTypingSessionActive = () => getKeystrokeManager().getIsTypingSessionActive;

    const promptAccessWarning = () => {
        console.warn('You are not authorized to use the hook.');
        console.log('Make sure to provide a valid access key.');
    }

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
     * @returns {Promise<IKeystrokeResult | undefined>} - A promise that resolves to the keystroke result or undefined if the submission is skipped.
     */
    const handleSubmit = useCallback(async (): Promise<IKeystrokeResult | undefined> => {
        if (isSending) return;

        setDesktopTextValue("");
        setIsSending(true);

        const typingData = getKeystrokeManager().endTypingSession();

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

        const neuroProfileResp = await getReducedNeuroprofile(userUID, userToken, typingData);

        getKeystrokeManager().resetTypingData();
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
    }, [isSending, userToken, userUID]);

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
