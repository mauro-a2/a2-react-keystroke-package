import axios from "axios";

const a2API = axios.create({
    baseURL: process.env.A2_NEUROP_BASE_URL,
    headers: {
        "Content-Type": 'application/json'
    }
});

export default a2API;