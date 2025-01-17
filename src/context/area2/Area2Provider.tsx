import React, { useCallback, useEffect, useReducer } from 'react';
import { Area2Context, area2Reducer } from '.';
import { ICredentialsConfig } from '../../interfaces';

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

    const validateAccessToken = useCallback(() => {

        const { apiKey } = config;

        if (apiKey.length === 0) {
            dispatch({ type: '[A2 Auth] - Deny Access' });
            return;
        }

        //TODO: Validate api key here
        console.log(apiKey);
        dispatch({ type: '[A2 Auth] - Allow Access' });
    }, [config]);


    useEffect(() => {
        validateAccessToken();
    }, [validateAccessToken]);


    return (
        <Area2Context.Provider value={{
            ...state
        }}>
            {children}
        </Area2Context.Provider>
    )
}