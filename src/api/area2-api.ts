type RequestOptions = {
    headers?: Record<string, string>;
    // ...other possible options...
};

const baseURL = process.env.A2_NEUROP_BASE_URL;

const a2API = {
    get: async (url: string, options: RequestOptions = {}) => {
        const response = await fetch(`${baseURL}${url}`, {
            method: 'GET',
            headers: {
                "Content-Type": 'application/json',
                ...options.headers
            },
            ...options
        });
        return response.json();
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

export default a2API;