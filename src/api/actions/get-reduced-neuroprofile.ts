import type { AxiosError } from "axios";
import type { IKeystrokeCollection, IMobileKeystrokeCollection } from "@area2-ai/a2-node-keystroke-package";

import a2API from "../area2-api";
import { formatKeystrokeData } from "../../helpers";
import type {
    IA2APIResponse,
} from "../../interfaces";

export type NeuroprofileResponse = {
    ok: boolean;
    neuroprofile?: unknown;
    error?: string;
    message?: string;
}

/**
 * Asynchronously generates a reduced neuroprofile for a user based on their typing data.
 *
 * @param {string} userID - The unique identifier of the user for whom the neuroprofile is generated.
 * @param {string} token - A token used for authentication or authorization purposes.
 * @param {IKeystrokeCollection | IMobileKeystrokeCollection} typingData - The user's typing data, which can be either desktop or mobile keystroke collections.
 * @param {'Desktop' | 'Mobile'} platform - The platform type indicating whether the typing data is from a desktop or mobile device.
 * @param {string[]} a2Actions - Action that determines the type of response to be received from the server.
 * @returns {Promise<NeuroprofileResponse>} A promise that resolves to a NeuroprofileResponse containing the neuroprofile data.
 */

export const getReducedNeuroprofile = async (
    userID: string,
    token: string,
    typingData: IKeystrokeCollection | IMobileKeystrokeCollection,
    platform: 'Desktop' | 'Mobile',
    a2Actions: string[],
): Promise<NeuroprofileResponse> => {

    const formattedBody = formatKeystrokeData(platform, typingData);

    const dataToSend = {
        'a2_actions': a2Actions,
        'keystroke_data': {
            ...formattedBody,
            'user_id': userID,
        }
    }

    try {
        const { data } = await a2API.post<IA2APIResponse>('/get_reduced_neuroprofile', dataToSend, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (data.status === 'error') {
            const { error, message } = data;
            return {
                ok: false,
                error,
                message
            }
        }

        const { results } = data;

        return {
            ok: true,
            neuroprofile: results!,
        }
    } catch (error) {
        const err = error as AxiosError<NeuroprofileResponse>;
        console.error('Error when connecting to api: ', err.message);
        return {
            ok: false,
            message: `Error when connecting to api, reason: ${err.response?.data.message}`,
            error: err.message
        }
    }

}