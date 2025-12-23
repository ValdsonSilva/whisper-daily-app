// src/services/api.ts
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@env";

const api = axios.create({
    baseURL: API_BASE_URL,
    // headers: {
    //     "Content-Type": "Aplication/Json"
    // },
    // timeout: 15000, // 15s, pode ajustar
});

// (Opcional) Interceptor pra adicionar token de auth depois
api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
