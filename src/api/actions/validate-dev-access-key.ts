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
        const response = await a2DevAccessAPI.get<IA2DevAccessKeyResponse>('/check-client-access-key', {
            headers: {
                Authorization: `Bearer ${devAccessKey}`
            }
        });

        if (!response.success) {
            const { error } = response;
            return {
                ok: false,
                error,
            }
        }

        return {
            ok: response.success,
        }
    } catch (error) {
        console.error('Error: ', (error as any).message);
        return {
            ok: false,
            error: (error as any).response?.data.error || (error as any).message
        }
    }
}