import axios from "axios";

const a2DevAccessAPI = axios.create({
    baseURL: process.env.A2_DEVKEY_BASE_URL,
    headers: {
        "Content-Type": 'application/json'
    }
});

export default a2DevAccessAPI;