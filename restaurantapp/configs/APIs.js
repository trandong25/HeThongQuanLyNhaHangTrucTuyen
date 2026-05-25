import axios from "axios";
const BASE_URL = "http://10.60.250.82:8000/";

export const endpoints = {
    'categories': '/categories/',
    'dishes': '/dishes/',
    'login': "/o/token/",
    'register': "/users/",
    'dishes': '/dishes/',
    "current-user": "/users/current-user/",
    'dish-detail':  (foodId) => `/dishes/${foodId}/`,
    'dish-reviews': (foodId) => `/dishes/${foodId}/reviews/`,
    'reservations': "/reservations/",
    'orders': '/orders/',
    'order-detail': (orderId) => `/orders/${orderId}/`,
    'ingredients': '/ingredients/',
};

export const authApis = (token) => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export default axios.create({
    baseURL: BASE_URL
});
