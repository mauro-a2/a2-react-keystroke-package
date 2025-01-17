import { ChangeEvent, useCallback, useContext, useRef, useState } from "react";
import { KeystrokeManager } from "@area2-ai/a2-node-keystroke-package";

import { Area2Context } from "../context";
import { getBrowserInfo, getOsInfo } from "../utils";
import { getReducedNeuroprofile } from "../api";
import type { IKeystrokeResult } from "../interfaces";

/**
 * Keystroke for desktop browsers
 */
export const useKeystroke = (userUID: string, userToken: string) => {

    const keystrokeManagerRef = useRef(new KeystrokeManager());

    const { canAccess } = useContext(Area2Context);

    const [textInput, setTextInput] = useState("");
    const [isSending, setIsSending] = useState(false);

    const promptAccessWarning = () => {
        console.warn('You are not authorized to access the hook.');
        console.log('Make sure to provide a valid access key.');
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (!canAccess) {
            promptAccessWarning();
            return;
        }
        const newValue = event.target.value;
        keystrokeManagerRef.current.processInputChange(newValue);
        setTextInput(newValue);
    };

    const handleSubmit = useCallback(async (): Promise<IKeystrokeResult | undefined> => {
        if (isSending) return;

        setIsSending(true);

        const typingData = keystrokeManagerRef.current.endTypingSession();

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
            console.warn(`${neuroProfileResp.message}`);
            console.error(`${neuroProfileResp.error}`);
            return {
                error: neuroProfileResp.error,
                message: neuroProfileResp.message
            };
        }

        return { data: neuroProfileResp.neuroprofile! };
    }, [isSending, userToken, userUID]);

    const handleKeydown = useCallback((key: string) => {
        if (!canAccess) {
            promptAccessWarning();
            return;
        }
        keystrokeManagerRef.current.processKeydown(key);
    }, [canAccess]);

    const handleKeyup = useCallback((key: string) => {
        if (!canAccess) {
            promptAccessWarning();
            return;
        }
        keystrokeManagerRef.current.processKeyup(key);
    }, [canAccess]);

    return {
        textInput,
        handleInputChange,
        handleKeydown,
        handleKeyup,
        isTypingSessionActive: keystrokeManagerRef.current.getIsTypingSessionActive,
        getNeuroprofile: handleSubmit
    };
};
