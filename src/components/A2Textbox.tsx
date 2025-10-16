import React from 'react';
import { getPlatform } from '../utils';

import { A2AndroidTextInput } from './A2AndroidTextInput';
import { A2IosTextInput } from './A2IosTextInput';
import { A2DesktopTextInput } from './A2DesktopTextInput';

import type { TargetPlatform } from '../interfaces';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    ref?: React.Ref<HTMLInputElement>;
    target?: TargetPlatform;
    handleEndSessionOnEnter?: Function;
}

/**
 * Component that renders a text input field and generates an A2CapturePayload data.
 * 
 * @param {React.Ref<HTMLInputElement>} [ref] - Optional ref for the input element.
 * @param {TargetPlatform} [target] - Optional target platform ('ios', 'android', 'desktop'). If not provided, it will be auto-detected.
 * @param {Function} [handleEndSessionOnEnter] - Optional function to handle ending the session on Enter key press (only for desktop).
 */
export const A2Textbox = ({ ref, target, handleEndSessionOnEnter, ...rest }: Props) => {
    const targetPlatform = target ?? getPlatform();

    if (targetPlatform === 'android') {
        return (
            <A2AndroidTextInput {...rest} ref={ref} />
        )
    }

    if (targetPlatform === 'ios') {
        return (
            <A2IosTextInput {...rest} ref={ref} />
        )
    }

    return (
        <A2DesktopTextInput {...rest} ref={ref} handleEndSessionOnEnter={handleEndSessionOnEnter} />
    )
}
