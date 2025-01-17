import { osName } from 'react-device-detect';

export const getOsInfo = (): string => osName;