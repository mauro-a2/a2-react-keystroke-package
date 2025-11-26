import { useCallback, useContext } from "react";

import { Area2Context } from "../context";
import { getBrowserInfo, getOsInfo } from "../utils";
import type { A2CapturePayload, IDesktopKeystrokeHookTemplate } from "../interfaces";

/**
 * Keystroke hook for desktop platforms.
 */
export const useDesktopKeystroke = (): IDesktopKeystrokeHookTemplate<A2CapturePayload> => {

    const { getKeystrokeManager } = useContext(Area2Context);

    const getIsTypingSessionActive = () => getKeystrokeManager().getIsTypingSessionActive;

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
     * Ends the typing session and returns the typing data.
     * @returns {A2CapturePayload | undefined} - The typing session data or undefined if no data.
     */
    const handleEndTypingSession = useCallback((): A2CapturePayload | undefined => {

        const typingData = getKeystrokeManager().endTypingSession();
        getKeystrokeManager().resetTypingData();

        if (!typingData.startUnixTime) {
            console.warn(`Empty typing data for session: ${typingData.sessionID}. Skipping...`);
            return;
        }

        typingData.appContext = `${getOsInfo()} - ${getBrowserInfo()}`;

        return typingData;
    }, []);

    return {
        handleProcessKeydown,
        handleProcessKeyup,
        getIsTypingSessionActive,
        handleEndTypingSession
    };
};
