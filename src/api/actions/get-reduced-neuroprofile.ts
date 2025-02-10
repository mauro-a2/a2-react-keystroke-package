import type { AxiosError } from "axios";
import type { IKeystrokeCollection, IMobileKeystrokeCollection } from "@area2-ai/a2-node-keystroke-package";

import a2API from "../area2-api";
import { a2Actions } from "../../constants";
import { formatKeystrokeData } from "../../helpers";
import type { A2ActionTypes, IA2APIResponse, IA2ChatbotResults } from "../../interfaces";

export type NeuroprofileResponse = {
    ok: boolean;
    neuroprofile?: IA2ChatbotResults;
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
 * @param {'default' | 'chatbot' | 'extension'} a2Action - Action that determines the type of response to be received from the server.
 * @returns {Promise<NeuroprofileResponse>} A promise that resolves to a NeuroprofileResponse containing the reduced neuroprofile data.
 */

export const getReducedNeuroprofile = async (
    userID: string,
    token: string,
    typingData: IKeystrokeCollection | IMobileKeystrokeCollection,
    platform: 'Desktop' | 'Mobile',
    a2Action: A2ActionTypes
): Promise<NeuroprofileResponse> => {

    const formattedBody = formatKeystrokeData(platform, typingData);

    const dataToSend = {
        'a2_actions': [a2Actions[a2Action]],
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
            neuroprofile: results!.a2_chatbot,
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