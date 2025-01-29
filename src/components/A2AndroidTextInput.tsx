import React from 'react';
import { useMobileKeystrokeAndroid } from '../hooks';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    userID: string;
    userToken: string;
}

/**
 * Component that renders an input field for Android mobile devices
 * with keystroke tracking and additional event handlers.
 *
 * @param {string} userID - The ID of the user.
 * @param {string} userToken - The token of the user.
 */
export const A2AndroidTextInput = ({ userID, userToken, ...rest }: Props) => {

    const {
        handleInputChange,
        textInput,
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

                value={textInput}
                onChange={handleInputChange}

                onPaste={handlePaste}
                onInput={({ currentTarget }) => { handleKeyInput(currentTarget.value) }}
                onBeforeInput={({ currentTarget }) => handleBeforeInput(currentTarget.value)}
                {...rest}
            />
        </>
    )
}
