import React from 'react';
import { useDesktopKeystroke } from '../hooks';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    ref?: React.Ref<HTMLInputElement>;
    handleEndSessionOnEnter?: Function;
}

/**
 * Component that renders a text input field and generates an A2CapturePayload data.
 * 
 * @param {React.Ref<HTMLInputElement>} [ref] - Optional ref for the input element.
 * @param {Function} [handleEndSessionOnEnter] - Optional function to handle ending the session on Enter key press.
 */
export const A2DesktopTextInput = ({ ref, onChange, handleEndSessionOnEnter, ...rest }: Props) => {

    const {
        handleProcessKeydown,
        handleProcessKeyup,
        getIsTypingSessionActive
    } = useDesktopKeystroke();


    return (
        <>
            <input
                ref={ref}
                type="text"
                placeholder="Using desktop implementation"

                onKeyDownCapture={({ key }) => handleProcessKeydown(key)}
                onKeyUpCapture={({ key }) => {
                    handleProcessKeyup(key);

                    //? Handle ENTER key
                    if (key !== 'Enter') { return }
                    if (!getIsTypingSessionActive()) { return }
                    handleEndSessionOnEnter?.(); //? Call parent's function if it exists
                }}

                onChange={(event) => {
                    onChange?.(event); //? Execute parent's onChange if it exists
                }}
                {...rest}
            />
        </>
    )
}
