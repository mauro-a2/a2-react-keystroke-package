import React from 'react';
import { useKeystroke } from '../hooks';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    handleSubmitOnEnter?: () => Promise<void>;
}

/**
 * Component that renders an input field
 * with keystroke tracking and optional submit on Enter key functionality.
 * @param {() => Promise<void>} [handleSubmitOnEnter] - Optional function to handle submit on Enter key press.
 */
export const A2TextInput = ({ handleSubmitOnEnter, ...rest }: Props) => {

    const {
        handleInputChange,
        handleKeydown,
        handleKeyup,
        value,
        getIsTypingSessionActive,
    } = useKeystroke();


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

                value={value}
                onChange={handleInputChange}
                {...rest}
            />
        </>
    )
}
