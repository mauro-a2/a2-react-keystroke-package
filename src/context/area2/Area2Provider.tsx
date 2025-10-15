import React, { useCallback, useEffect, useReducer, useRef } from 'react';
import {
    KeystrokeManager,
    AndroidKeystrokeManager,
    IosKeystrokeManager
} from '@area2-ai/a2-node-keystroke-package';

import { Area2Context, area2Reducer } from '.';

export interface Area2State {
    desktopTextValue: string;
    iOSTextValue: string;
    androidTextValue: string;
}

interface Props {
    children: React.ReactNode;
}

const AREA2_INITIAL_STATE: Area2State = {
    desktopTextValue: '',
    androidTextValue: '',
    iOSTextValue: ''
}

export const Area2Provider = ({ children }: Props) => {

    const [state, dispatch] = useReducer(area2Reducer, AREA2_INITIAL_STATE);

    const keystrokeManagerRef = useRef<KeystrokeManager>();
    const androidKeystrokeManagerRef = useRef<AndroidKeystrokeManager>();
    const iosKeystrokeManagerRef = useRef<IosKeystrokeManager>();

    const getKeystrokeManager = () => keystrokeManagerRef.current!;
    const getAndroidKeystrokeManager = () => androidKeystrokeManagerRef.current!;
    const getIosKeystrokeManager = () => iosKeystrokeManagerRef.current!;

    const setDesktopTextValue = useCallback((value: string) => {
        dispatch({ type: '[A2 Desktop] - Update text', payload: { newValue: value } })
    }, []);

    const setIOSTextValue = useCallback((value: string) => {
        dispatch({ type: '[A2 iOS] - Update text', payload: { newValue: value } })
    }, []);

    const setAndroidTextValue = useCallback((value: string) => {
        dispatch({ type: '[A2 Android] - Update text', payload: { newValue: value } })
    }, []);

    useEffect(() => {
        keystrokeManagerRef.current = new KeystrokeManager();
        androidKeystrokeManagerRef.current = new AndroidKeystrokeManager();
        iosKeystrokeManagerRef.current = new IosKeystrokeManager();
    }, []);

    return (
        <Area2Context.Provider value={{
            ...state,

            //Methods
            getKeystrokeManager,
            getAndroidKeystrokeManager,
            getIosKeystrokeManager,
            setDesktopTextValue,
            setIOSTextValue,
            setAndroidTextValue
        }}>
            {children}
        </Area2Context.Provider>
    )
}