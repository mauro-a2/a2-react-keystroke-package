import React from 'react';
import { getPlatform } from '../utils';

import { A2AndroidTextInput } from './A2AndroidTextInput';
import { A2IosTextInput } from './A2IosTextInput';
import { A2DesktopTextInput } from './A2DesktopTextInput';

import type { TargetPlatform } from '../interfaces';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    ref?: React.Ref<HTMLInputElement>;
    target?: TargetPlatform;
}

export const A2Textbox = ({ ref, target, ...rest }: Props) => {
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
        <A2DesktopTextInput {...rest} ref={ref} />
    )
}
