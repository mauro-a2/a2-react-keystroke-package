import React from 'react';
import { useKeystroke } from '../hooks';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    userID: string;
    userToken: string;
    handleSubmitOnEnter?: () => Promise<void>;
}

/**
 * Component that renders an input field
 * with keystroke tracking and optional submit on Enter key functionality.
 *
 * @param {string} userID - The ID of the user.
 * @param {string} userToken - The token of the user.
 * @param {() => Promise<void>} [handleSubmitOnEnter] - Optional function to handle submit on Enter key press.
 */
export const A2TextInput = ({ userID, userToken, handleSubmitOnEnter, ...rest }: Props) => {

    const {
        handleInputChange,
        handleKeydown,
        handleKeyup,
        textInput,
        getIsTypingSessionActive,
    } = useKeystroke(userID, userToken);


    return (
        <>
            <input
                type="text"
                placeholder="Using desktop collection"

                onKeyDownCapture={({ key }) => handleKeydown(key)}
                onKeyUpCapture={({ key }) => {
                    handleKeyup(key);

                    //? Handle ENTER key
                    if (!handleSubmitOnEnter) { return }
                    if (key !== 'Enter') { return }
                    if (!getIsTypingSessionActive()) { return }
                    handleSubmitOnEnter();
                }}

                value={textInput}
                onChange={handleInputChange}
                {...rest}
            />
        </>
    )
}
