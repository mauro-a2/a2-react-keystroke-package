import React, { useCallback, useEffect, useReducer, useRef } from 'react';
import { KeystrokeManager } from '@area2-ai/a2-node-keystroke-package';

import { Area2Context, area2Reducer } from '.';
import { validateDevAccessKey } from '../../api';
import type { ICredentialsConfig } from '../../interfaces';

export interface Area2State {
    canAccess: boolean;
}

interface Props {
    children: React.ReactNode;
    config: ICredentialsConfig;
}

const AREA2_INITIAL_STATE: Area2State = {
    canAccess: false,
}

export const Area2Provider = ({ children, config }: Props) => {

    const [state, dispatch] = useReducer(area2Reducer, AREA2_INITIAL_STATE);

    const keystrokeManagerRef = useRef<KeystrokeManager>();

    const getKeystrokeManager = () => keystrokeManagerRef.current!;

    const validateAccessToken = useCallback(async () => {

        const { apiKey } = config;

        if (apiKey.length === 0) {
            dispatch({ type: '[A2 Auth] - Deny Access' });
            return;
        }

        const response = await validateDevAccessKey(apiKey);

        if (!response.ok) {
            dispatch({ type: '[A2 Auth] - Deny Access' });
            console.warn(`Error validating access key: ${response.error}`);
            return;
        }

        dispatch({ type: '[A2 Auth] - Allow Access' });
    }, [config]);

    useEffect(() => {
        validateAccessToken();
    }, [validateAccessToken]);

    useEffect(() => {
        keystrokeManagerRef.current = new KeystrokeManager();
    }, []);

    return (
        <Area2Context.Provider value={{
            ...state,

            //Methods
            getKeystrokeManager,
        }}>
            {children}
        </Area2Context.Provider>
    )
}