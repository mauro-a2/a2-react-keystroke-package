import React from 'react';
import { useMobileKeystrokeAndroid } from '../hooks';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    ref?: React.Ref<HTMLInputElement>;
}

/**
 * Component that renders a text input field and generates an A2CapturePayload data.
 * @param {React.Ref<HTMLInputElement>} [ref] - Optional ref for the input element.
 */
export const A2AndroidTextInput = ({ ref, autoCapitalize, value, ...rest }: Props) => {

    const {
        handleProcessKeydown,
        handleProcessKeyup,
        handleProcessPaste,
        handleProcessKeyInput,
        handleProcessOnBeforeInput
    } = useMobileKeystrokeAndroid();

    return (
        <>
            <input
                ref={ref}
                type="text"
                placeholder="Using android implementation"
                autoCapitalize={autoCapitalize || 'sentences'}

                onKeyDown={({ currentTarget }) => handleProcessKeydown(currentTarget)}
                onKeyUp={handleProcessKeyup}

                onPaste={handleProcessPaste}
                onInput={({ currentTarget }) => { handleProcessKeyInput(currentTarget.value) }}
                onBeforeInput={({ currentTarget }) => handleProcessOnBeforeInput(currentTarget.value, value?.toString() || '')}
                {...rest}
            />
        </>
    )
}
