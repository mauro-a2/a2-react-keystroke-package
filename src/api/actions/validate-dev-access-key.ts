import type { AxiosError } from "axios";
import a2DevAccessAPI from "../dev-access-api";
import type { IA2DevAccessKeyResponse } from "../../interfaces/IA2DevAccessKeyResponse";

export type CheckAccessKeyResponse = {
    ok: boolean;
    error?: string;
}

/**
 * Validates the developer access key.
 * @param {string} devAccessKey - The developer access key to be validated.
 * @returns {Promise<CheckAccessKeyResponse>} - A promise that resolves to the response indicating whether the access key is valid.
 */
export const validateDevAccessKey = async (devAccessKey: string): Promise<CheckAccessKeyResponse> => {
    try {
        const { data } = await a2DevAccessAPI.get<IA2DevAccessKeyResponse>('/check-client-access-key', {
            headers: {
                Authorization: `Bearer ${devAccessKey}`
            }
        });

        if (!data.success) {
            const { error } = data;
            return {
                ok: false,
                error,
            }
        }

        return {
            ok: data.success,
        }
    } catch (error) {
        const err = error as AxiosError<CheckAccessKeyResponse>;
        console.error('Error: ', err.message);
        return {
            ok: false,
            error: err.response?.data.error || err.message
        }
    }
}