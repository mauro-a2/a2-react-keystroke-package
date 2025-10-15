import type { TargetPlatform } from "../interfaces";
import { useMobileKeystrokeAndroid } from "./useKeystroke.android";
import { useDesktopKeystroke } from "./useKeystroke.desktop";
import { useMobileKeystrokeIOS } from "./useKeystroke.ios";

export const useKeystrokeBuilder = (target: TargetPlatform) => {
    switch (target) {
        case 'android':
            return useMobileKeystrokeAndroid;
        case 'ios':
            return useMobileKeystrokeIOS;
        case 'desktop':
        default:
            return useDesktopKeystroke;
    }
}