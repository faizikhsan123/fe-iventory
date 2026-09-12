import axios from "axios";

export const  AxiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/api/"
})

// endpoint storage link laravel
export const STORAGE_URL = "http://127.0.0.1:8000/storage/"

// ini agar token bisa dikirim ke backend setiap kali melakukan request
AxiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})