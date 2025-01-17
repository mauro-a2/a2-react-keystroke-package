import { ClipboardEvent, ChangeEvent, useCallback, useEffect, useState, useRef, useContext } from "react";
import { IosKeystrokeManager } from "@area2-ai/a2-node-keystroke-package";

import { Area2Context } from "../context";
import { getBrowserInfo, getOsInfo } from "../utils";
import { getReducedNeuroprofile } from "../api";
import type { IKeystrokeResult } from "../interfaces";

/**
 * Keystroke for ios mobile browser
 *  @param {string} userUID - The unique identifier of the user for whom the neuroprofile is generated.
 *  @param {string} userToken - A token used for authentication or authorization purposes.
 */
export const useMobileKeystrokeIOS = (userUID: string, userToken: string) => {

    const keystrokeManagerRef = useRef(new IosKeystrokeManager());

    const { canAccess } = useContext(Area2Context);

    const [textInput, setTextInput] = useState("");
    const [isSending, setIsSending] = useState(false);

    const handleOnBeforeInput = useCallback((value: number) => {
        if (!canAccess) { return }
        keystrokeManagerRef.current.setPrevContentLength = value;
    }, [canAccess]);

    const handlePaste = useCallback((event: ClipboardEvent<HTMLInputElement>) => {
        if (!canAccess) { return }
        const pastedText = event.clipboardData.getData("text");
        keystrokeManagerRef.current.processPaste(pastedText);
    }, [canAccess]);

    useEffect(() => {
        keystrokeManagerRef.current.processAutocorrection(textInput);
    }, [textInput]);


    const checkForPrediction = useCallback((newValue: string) => {
        const textSnapshot = textInput; // Before it changes
        if (!canAccess) { return }
        keystrokeManagerRef.current.processPrediction(newValue, textSnapshot);
    }, [canAccess, textInput]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        if (!canAccess) { return }
        checkForPrediction(newValue);
        setTextInput(newValue);
    }

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

    const handleKeydown = useCallback((keyPressed: string, target: HTMLInputElement) => {
        if (!canAccess) { return }
        keystrokeManagerRef.current.processKeydown(keyPressed, target);
    }, [canAccess]);

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