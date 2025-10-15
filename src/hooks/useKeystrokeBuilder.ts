import { getPlatform } from "../utils";
import type {
    TargetPlatform,
    IiOSKeystrokeHookTemplate,
    IAndroidKeystrokeHookTemplate,
    IDesktopKeystrokeHookTemplate
} from "../interfaces";

import { useMobileKeystrokeAndroid } from "./useKeystroke.android";
import { useDesktopKeystroke } from "./useKeystroke.desktop";
import { useMobileKeystrokeIOS } from "./useKeystroke.ios";

export function useKeystrokeBuilder(target: 'ios'): IiOSKeystrokeHookTemplate<any>;
export function useKeystrokeBuilder(target: 'android'): IAndroidKeystrokeHookTemplate<any>;
export function useKeystrokeBuilder(target: 'desktop'): IDesktopKeystrokeHookTemplate<any>;
export function useKeystrokeBuilder(target?: TargetPlatform): IiOSKeystrokeHookTemplate<any> | IAndroidKeystrokeHookTemplate<any> | IDesktopKeystrokeHookTemplate<any>;
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