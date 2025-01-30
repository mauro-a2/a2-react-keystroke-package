import React from 'react';
import { useMobileKeystrokeAndroid } from '../hooks';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    userUID: string;
    userToken: string;
}

/**
 * Component that renders an input field for Android mobile devices
 * with keystroke tracking and additional event handlers.
 *
 * @param {string} userUID - The ID of the user.
 * @param {string} userToken - The token of the user.
 */
export const A2AndroidTextInput = ({ userUID: userID, userToken, ...rest }: Props) => {

    const {
        handleInputChange,
        value,
        handleKeydown,
        handleKeyup,
        handlePaste,
        handleKeyInput,
        handleBeforeInput
    } = useMobileKeystrokeAndroid(userID, userToken);

    return (
        <>
            <input
                type="text"
                placeholder="Using android mobile input"
                autoCapitalize="sentences"

                onKeyDown={({ currentTarget }) => handleKeydown(currentTarget)}
                onKeyUp={handleKeyup}

                value={value}
                onChange={handleInputChange}

                onPaste={handlePaste}
                onInput={({ currentTarget }) => { handleKeyInput(currentTarget.value) }}
                onBeforeInput={({ currentTarget }) => handleBeforeInput(currentTarget.value)}
                {...rest}
            />
        </>
    )
}
