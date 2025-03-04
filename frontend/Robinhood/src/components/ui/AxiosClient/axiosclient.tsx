/* eslint-disable react-refresh/only-export-components */
import axios from "axios";

export default axios.create({
    baseURL: "http://localhost:5000/robinhood",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true
});