import React from 'react';
import { useMobileKeystrokeIOS } from '../hooks';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> { }

/**
 * Component that renders an input field for iOS mobile devices
 * with keystroke tracking and additional event handlers.
 */
export const A2IosTextInput = ({ ...rest }: Props) => {

    const {
        handleInputChange,
        value,
        handleKeydown,
        handleKeyup,
        handlePaste,
        handleOnBeforeInput,
    } = useMobileKeystrokeIOS();

    return (
        <>
            <input
                type="text"
                placeholder="Using ios mobile input"

                onKeyDownCapture={({ key, currentTarget }) => handleKeydown(key, currentTarget)}
                onKeyUpCapture={({ key }) => handleKeyup(key)}

                value={value}
                onChange={handleInputChange}
                onPaste={handlePaste}
                onBeforeInput={({ currentTarget }) => { handleOnBeforeInput(currentTarget.value.length) }}
                {...rest}
            />
        </>
    )
}
