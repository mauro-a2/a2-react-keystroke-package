import React, { useEffect, useReducer, useRef } from 'react';
import {
    KeystrokeManager,
    AndroidKeystrokeManager,
    IosKeystrokeManager
} from '@area2-ai/a2-node-keystroke-package';

import { Area2Context, area2Reducer } from '.';

export interface Area2State { }

interface Props {
    children: React.ReactNode;
}

const AREA2_INITIAL_STATE: Area2State = {}

export const Area2Provider = ({ children }: Props) => {

    const [state] = useReducer(area2Reducer, AREA2_INITIAL_STATE); //[state, dispatch]

    const keystrokeManagerRef = useRef<KeystrokeManager>();
    const androidKeystrokeManagerRef = useRef<AndroidKeystrokeManager>();
    const iosKeystrokeManagerRef = useRef<IosKeystrokeManager>();

    const getKeystrokeManager = () => keystrokeManagerRef.current!;
    const getAndroidKeystrokeManager = () => androidKeystrokeManagerRef.current!;
    const getIosKeystrokeManager = () => iosKeystrokeManagerRef.current!;

    useEffect(() => {
        keystrokeManagerRef.current = new KeystrokeManager();
        androidKeystrokeManagerRef.current = new AndroidKeystrokeManager();
        iosKeystrokeManagerRef.current = new IosKeystrokeManager();
    }, []);

    return (
        <Area2Context.Provider value={{
            ...state,
            getKeystrokeManager,
            getAndroidKeystrokeManager,
            getIosKeystrokeManager
        }}>
            {children}
        </Area2Context.Provider>
    )
}