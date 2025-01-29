import React from 'react';
import { useMobileKeystrokeIOS } from '../hooks';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    userID: string;
    userToken: string;
}

/**
 * Component that renders an input field for iOS mobile devices
 * with keystroke tracking and additional event handlers.
 *
 * @param {string} userID - The ID of the user.
 * @param {string} userToken - The token of the user.
 */
export const A2IosTextInput = ({ userID, userToken, ...rest }: Props) => {

    const {
        handleInputChange,
        textInput,
        handleKeydown,
        handleKeyup,
        handlePaste,
        handleOnBeforeInput,
    } = useMobileKeystrokeIOS(userID, userToken);

    return (
        <>
            <input
                type="text"
                placeholder="Using ios mobile input"

                onKeyDownCapture={({ key, currentTarget }) => handleKeydown(key, currentTarget)}
                onKeyUpCapture={({ key }) => handleKeyup(key)}

                value={textInput}
                onChange={handleInputChange}
                onPaste={handlePaste}
                onBeforeInput={({ currentTarget }) => { handleOnBeforeInput(currentTarget.value.length) }}
                {...rest}
            />
        </>
    )
}
