import React from 'react';
import { useMobileKeystrokeIOS } from '../hooks';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    ref?: React.Ref<HTMLInputElement>;
}

/**
 * Component that renders a text input field and generates an A2CapturePayload data.
 * @param {React.Ref<HTMLInputElement>} [ref] - Optional ref for the input element.
 */
export const A2IosTextInput = ({ ref, value, onChange, ...rest }: Props) => {

    const {
        handleProcessInputChange,
        handleProcessKeydown,
        handleProcessKeyup,
        handleProcessPaste,
        handleProcessOnBeforeInput,
    } = useMobileKeystrokeIOS();

    return (
        <>
            <input
                ref={ref}
                type="text"
                placeholder="Using iOS implementation"

                onKeyDownCapture={({ key, currentTarget }) => handleProcessKeydown(key, currentTarget)}
                onKeyUpCapture={({ key }) => handleProcessKeyup(key)}

                onChange={(event) => {
                    handleProcessInputChange(event, value?.toString() || ''); //? Execute internal change handler
                    onChange?.(event); //? Execute parent's onChange if it exists
                }}
                onPaste={handleProcessPaste}
                onBeforeInput={({ currentTarget }) => { handleProcessOnBeforeInput(currentTarget.value.length) }}
                {...rest}
            />
        </>
    )
}
