import { browserName } from "react-device-detect";

export const getBrowserInfo = (): string => browserName;