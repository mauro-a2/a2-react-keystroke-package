import React from 'react';
import { useMobileKeystrokeAndroid } from '../hooks';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> { }

/**
 * Component that renders an input field for Android mobile devices
 * with keystroke tracking and additional event handlers.
 */
export const A2AndroidTextInput = ({ ...rest }: Props) => {

    const {
        handleInputChange,
        value,
        handleKeydown,
        handleKeyup,
        handlePaste,
        handleKeyInput,
        handleBeforeInput
    } = useMobileKeystrokeAndroid();

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
