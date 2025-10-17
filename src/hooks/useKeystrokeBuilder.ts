import type { IKeystrokeCollection, IMobileKeystrokeCollection } from "@area2-ai/a2-node-keystroke-package";
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

export function useKeystrokeBuilder(target: 'ios'): IiOSKeystrokeHookTemplate<IMobileKeystrokeCollection>;
export function useKeystrokeBuilder(target: 'android'): IAndroidKeystrokeHookTemplate<IMobileKeystrokeCollection>;
export function useKeystrokeBuilder(target: 'desktop'): IDesktopKeystrokeHookTemplate<IKeystrokeCollection>;
export function useKeystrokeBuilder(target?: TargetPlatform): IiOSKeystrokeHookTemplate<IMobileKeystrokeCollection> | IAndroidKeystrokeHookTemplate<IMobileKeystrokeCollection> | IDesktopKeystrokeHookTemplate<IKeystrokeCollection>;
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