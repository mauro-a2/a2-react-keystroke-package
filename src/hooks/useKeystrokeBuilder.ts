import { getPlatform } from "../utils";
import type {
    TargetPlatform,
    IiOSKeystrokeHookTemplate,
    IAndroidKeystrokeHookTemplate,
    IDesktopKeystrokeHookTemplate,
    A2CapturePayload
} from "../interfaces";

import { useMobileKeystrokeAndroid } from "./useKeystroke.android";
import { useDesktopKeystroke } from "./useKeystroke.desktop";
import { useMobileKeystrokeIOS } from "./useKeystroke.ios";

export function useKeystrokeBuilder(target: 'ios'): IiOSKeystrokeHookTemplate<A2CapturePayload>;
export function useKeystrokeBuilder(target: 'android'): IAndroidKeystrokeHookTemplate<A2CapturePayload>;
export function useKeystrokeBuilder(target: 'desktop'): IDesktopKeystrokeHookTemplate<A2CapturePayload>;
export function useKeystrokeBuilder(target?: TargetPlatform): IiOSKeystrokeHookTemplate<A2CapturePayload> | IAndroidKeystrokeHookTemplate<A2CapturePayload> | IDesktopKeystrokeHookTemplate<A2CapturePayload>;
export function useKeystrokeBuilder(target?: TargetPlatform) {

    const targetPlatform = target ?? getPlatform();

    switch (targetPlatform) {
        case 'android':
            return useMobileKeystrokeAndroid();
        case 'ios':
            return useMobileKeystrokeIOS();
        case 'desktop':
        default:
            return useDesktopKeystroke();
    }

}