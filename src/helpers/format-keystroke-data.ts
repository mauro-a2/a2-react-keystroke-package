import type { IKeystrokeCollection, IMobileKeystrokeCollection } from "@area2-ai/a2-node-keystroke-package";

/**
 * Formats keystroke data based on the platform type.
 * 
 * @param platform - The platform type, either 'Desktop' or 'Mobile'.
 * @param typingData - The keystroke data collection, which can be either IKeystrokeCollection or IMobileKeystrokeCollection.
 * @returns The formatted keystroke data.
 */
export const formatKeystrokeData = (
    platform: 'Desktop' | 'Mobile',
    typingData: IKeystrokeCollection | IMobileKeystrokeCollection
) => {
    let formattedBody;

    if (platform === 'Desktop') {
        const {
            keyArea,
            keyTypes,
            pressTimes,
            qualityCheck,
            releaseTimes,
            sessionID,
            startUnixTime,
            textStructure,
            timeZone,
            ...rest
        } = typingData as IKeystrokeCollection;

        formattedBody = {
            'key_area': keyArea,
            'key_type': keyTypes,
            'press_times': pressTimes,
            'quality_check': qualityCheck,
            'release_times': releaseTimes,
            'session_id': sessionID,
            'startunixtime': startUnixTime,
            'text_structure': textStructure,
            'timezone': timeZone,
            ...rest,
        }

        return formattedBody;
    }

    const {
        autocorrectLengths,
        autocorrectTimes,
        keyArea,
        keyTypes,
        predictionLengths,
        predictionTimes,
        pressTimes,
        qualityCheck,
        releaseTimes,
        sessionID,
        startUnixTime,
        timeZone,
        ...rest
    } = typingData as IMobileKeystrokeCollection;

    formattedBody = {
        'autocorrect_lengths': autocorrectLengths,
        'autocorrect_times': autocorrectTimes,
        'prediction_lengths': predictionLengths,
        'prediction_times': predictionTimes,
        'key_area': keyArea,
        'key_type': keyTypes,
        'press_times': pressTimes,
        'quality_check': qualityCheck,
        'release_times': releaseTimes,
        'session_id': sessionID,
        'startunixtime': startUnixTime,
        'timezone': timeZone,
        ...rest,
    }

    return formattedBody;
}