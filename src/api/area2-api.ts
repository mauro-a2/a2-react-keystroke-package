import axios from "axios";

const a2API = axios.create({
    baseURL: 'https://default.demo.area2-ai.com',
    headers: {
        "Content-Type": 'application/json'
    }
});

export default a2API;