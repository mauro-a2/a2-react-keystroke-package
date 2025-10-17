import { ChangeEvent, useCallback, useContext, useState } from "react";
import type { IKeystrokeCollection } from "@area2-ai/a2-node-keystroke-package";

import { Area2Context } from "../context";
import { getBrowserInfo, getOsInfo } from "../utils";
import type { IDesktopKeystrokeHookTemplate, IErrorMessage } from "../interfaces";

/**
 * Keystroke hook for desktop platforms.
 */
export const useDesktopKeystroke = (): IDesktopKeystrokeHookTemplate<IKeystrokeCollection> => {

    const [typingSession, setTypingSession] = useState<IKeystrokeCollection | null>(null);

    const { getKeystrokeManager } = useContext(Area2Context);

    const getIsTypingSessionActive = () => getKeystrokeManager().getIsTypingSessionActive;

    /**
     * Handles the input change event
     * @param {ChangeEvent<HTMLInputElement>} event - The input change event
     */
    const handleProcessInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        getKeystrokeManager().processInputChange(newValue);
    }

    /**
     * Handles the keydown event.
     * @param {string} key - The key pressed.
     */
    const handleProcessKeydown = useCallback((key: string) => {
        getKeystrokeManager().processKeydown(key);
    }, []);

    /**
     * Handles the keyup event.
     * @param {string} key - The key released.
     */
    const handleProcessKeyup = useCallback((key: string) => {
        getKeystrokeManager().processKeyup(key);
    }, []);

    /**
     * Ends the typing session and generates/returns the typing data.
     * @returns {IKeystrokeCollection | IErrorMessage} - The typing session data or an error message
     */
    const handleEndTypingSession = useCallback((): IKeystrokeCollection | IErrorMessage => {

        const typingData = getKeystrokeManager().endTypingSession();
        getKeystrokeManager().resetTypingData();

        if (!typingData.startUnixTime) {
            return {
                error: 'Empty typing data',
                message: `Empty typing data for session: ${typingData.sessionID}. Skipping...`
            };
        }

        typingData.appContext = `${getOsInfo()} - ${getBrowserInfo()}`;

        setTypingSession(typingData);
        return typingData;
    }, []);

    return {
        A2CapturePayload: typingSession,
        handleProcessInputChange,
        handleProcessKeydown,
        handleProcessKeyup,
        getIsTypingSessionActive,
        handleEndTypingSession
    };
};
