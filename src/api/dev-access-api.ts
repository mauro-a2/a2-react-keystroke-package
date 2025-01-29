type RequestOptions = {
    headers?: Record<string, string>;
    // ...other possible options...
};

const baseURL = process.env.A2_DEVKEY_BASE_URL;

const a2DevAccessAPI = {
    get: async <T>(url: string, options: RequestOptions = {}): Promise<T> => {
        const response = await fetch(`${baseURL}${url}`, {
            method: 'GET',
            headers: {
                "Content-Type": 'application/json',
                ...options.headers
            },
            ...options
        });
        return response.json() as Promise<T>;
    },
    post: async <T>(url: string, data: any, options: RequestOptions = {}): Promise<T> => {
        const response = await fetch(`${baseURL}${url}`, {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
                ...options.headers
            },
            body: JSON.stringify(data),
            ...options
        });
        return response.json() as Promise<T>;
    }
};

export default a2DevAccessAPI;