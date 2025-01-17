import { ClipboardEvent, ChangeEvent, useCallback, useState, useRef, useContext } from "react";
import { AndroidKeystrokeManager } from "@area2-ai/a2-node-keystroke-package";

import { Area2Context } from "../context";
import { getBrowserInfo, getOsInfo } from "../utils";
import type { IKeystrokeResult } from "../interfaces";
import { getReducedNeuroprofile } from "../api";

/**
 * Keystroke for android mobile browser
 */
export const useMobileKeystrokeAndroid = (userUID: string, userToken: string) => {

    const keystrokeManagerRef = useRef(new AndroidKeystrokeManager());

    const { canAccess } = useContext(Area2Context);

    const [isSending, setIsSending] = useState(false);
    const [textInput, setTextInput] = useState("");


    const handleBeforeInput = useCallback((currentValue: string) => {
        if (!canAccess) { return }
        keystrokeManagerRef.current.processBeforeInput(currentValue, textInput);
    }, [canAccess, textInput]);


    const handlePaste = useCallback((event: ClipboardEvent<HTMLInputElement>) => {
        if (!canAccess) { return }
        const pastedText = event.clipboardData.getData("text");
        keystrokeManagerRef.current.processPaste(pastedText);
    }, [canAccess]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        if (!canAccess) { return }
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

    const handleKeyInput = useCallback((inputContent: string) => {
        if (!canAccess) { return }
        keystrokeManagerRef.current.processKeyInput(inputContent);
    }, [canAccess]);


    const handleKeydown = useCallback(async (target: HTMLInputElement) => {
        if (!canAccess) { return }
        keystrokeManagerRef.current.processKeydown(target);
    }, [canAccess]);

    const handleKeyup = useCallback(() => {
        if (!canAccess) { return }
        keystrokeManagerRef.current.processKeyup();
    }, [canAccess]);

    return {
        textInput,
        handleInputChange,
        handleKeydown,
        handleKeyup,
        handlePaste,
        handleKeyInput,
        handleBeforeInput,
        getNeuroprofile: handleSubmit
    }

}