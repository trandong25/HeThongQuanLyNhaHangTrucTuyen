import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const BASE_URL =
    process.env.EXPO_PUBLIC_API_URL || "http://127.0.0.1:8000/";

const Apis = axios.create({
    baseURL: BASE_URL,
});

export const endpoints = {
    categories: "/categories/",
    dishes: "/dishes/",
    login: "/auth/login/",
    refresh: "/auth/refresh/",
    logout: "/auth/logout/",
    register: "/users/",
    "current-user": "/users/current-user/",
    "dish-detail": foodId => `/dishes/${foodId}/`,
    "dish-reviews": foodId => `/dishes/${foodId}/reviews/`,
    reservations: "/reservations/",
    orders: "/orders/",
    "order-detail": orderId => `/orders/${orderId}/`,
    "order-pay": id => `/orders/${id}/pay/`,
    ingredients: "/ingredients/",
    "stats-dish": "/stats/dish_stats/",
    "stats-revenue": "/stats/revenue_by_day/",
};

let refreshPromise = null;
let authFailureHandler = null;

export const setAuthFailureHandler = handler => {
    authFailureHandler = handler;
};

const clearSession = async () => {
    await AsyncStorage.multiRemove(["token", "refreshToken"]);

    if (authFailureHandler) {
        authFailureHandler();
    }
};

const authenticatedApi = axios.create({
    baseURL: BASE_URL,
});

authenticatedApi.interceptors.request.use(async config => {
    const accessToken = await AsyncStorage.getItem("token");

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

authenticatedApi.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        const refreshToken = await AsyncStorage.getItem("refreshToken");

        if (!refreshToken) {
            await clearSession();
            return Promise.reject(error);
        }

        try {
            if (!refreshPromise) {
                refreshPromise = Apis.post(endpoints.refresh, {
                    refresh: refreshToken,
                }).then(async response => {
                    const tokens = [["token", response.data.access]];

                    if (response.data.refresh) {
                        tokens.push(["refreshToken", response.data.refresh]);
                    }

                    await AsyncStorage.multiSet(tokens);
                    return response.data.access;
                }).finally(() => {
                    refreshPromise = null;
                });
            }

            const newAccessToken = await refreshPromise;
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            if (originalRequest.url === endpoints.logout) {
                const newRefreshToken = await AsyncStorage.getItem("refreshToken");
                originalRequest.data = JSON.stringify({
                    refresh: newRefreshToken,
                });
            }

            return authenticatedApi(originalRequest);
        } catch (refreshError) {
            await clearSession();
            return Promise.reject(refreshError);
        }
    }
);

export const authApis = () => authenticatedApi;

export default Apis;