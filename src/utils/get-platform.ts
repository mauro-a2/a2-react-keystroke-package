import { isAndroid, isDesktop } from "react-device-detect"
import { TargetPlatform } from "../interfaces"

export const getPlatform = (): TargetPlatform => {
    if (isAndroid) return 'android';
    if (isDesktop) return 'desktop';
    return 'ios';
}