import React from 'react';
import { useDesktopKeystroke } from '../hooks';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    ref?: React.Ref<HTMLInputElement>;
    endSessionOnEnter?: boolean;
}

/**
 * Component that renders a text input field and generates an A2CapturePayload data.
 * 
 * @param {React.Ref<HTMLInputElement>} [ref] - Optional ref for the input element.
 * @param {boolean} [endSessionOnEnter=false] - Whether to finish the typing session on Enter key press. Default is false.
 */
export const A2DesktopTextInput = ({ ref, endSessionOnEnter = false, onChange, ...rest }: Props) => {

    const {
        handleProcessInputChange,
        handleProcessKeydown,
        handleProcessKeyup,
        //! isTypingSessionActive,
        handleEndTypingSession,
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
                    // if (!isTypingSessionActive) { return }
                    if (endSessionOnEnter) { handleEndTypingSession() }
                }}

                onChange={(event) => {
                    handleProcessInputChange(event); //? Execute internal change handler
                    onChange?.(event); //? Execute parent's onChange if it exists
                }}
                {...rest}
            />
        </>
    )
}
