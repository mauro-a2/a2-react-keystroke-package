import { ChangeEvent, useCallback, useContext } from "react";
import type { IKeystrokeCollection } from "@area2-ai/a2-node-keystroke-package";

import { Area2Context } from "../context";
import { getBrowserInfo, getOsInfo } from "../utils";

/**
 * Keystroke for desktop browsers
 * @returns {Object} - An object containing the text input, input change handler, keydown handler, keyup handler, typing session status, and getNeuroprofile function.
 */
export const useKeystroke = () => {

    const {
        getKeystrokeManager,
        desktopTextValue,
        setDesktopTextValue
    } = useContext(Area2Context);

    const getIsTypingSessionActive = () => getKeystrokeManager().getIsTypingSessionActive;


    /**
     * Handles the input change event
     * @param {ChangeEvent<HTMLInputElement>} event - The input change event
     */
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        getKeystrokeManager().processInputChange(newValue);
        setDesktopTextValue(newValue);
    };

    /**
     * Handles the typing session while a previous session is still being sent.
     * @returns {IKeystrokeCollection | { error: string, message: string }} - The neuroprofile data or an error message.
     */
    const handleFinishTypingSession = useCallback((): IKeystrokeCollection | { error: string, message: string } => {

        setDesktopTextValue("");

        const typingData = getKeystrokeManager().endTypingSession();
        getKeystrokeManager().resetTypingData();

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
     * @param {string} key - The key that was pressed.
     */
    const handleKeydown = useCallback((key: string) => {
        getKeystrokeManager().processKeydown(key);
    }, []);

    /**
     * Handles the keyup event.
     * @param {string} key - The key that was released.
     */
    const handleKeyup = useCallback((key: string) => {
        getKeystrokeManager().processKeyup(key);
    }, []);

    return {
        value: desktopTextValue,
        handleInputChange,
        handleKeydown,
        handleKeyup,
        getIsTypingSessionActive,
        handleFinishTypingSession
    };
};
