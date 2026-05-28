import axios from "axios";
const BASE_URL = "http://192.168.1.49:8000/";

export const endpoints = {
    'categories': '/categories/',
    'dishes': '/dishes/',
    'login': "/o/token/",
    "login-proxy": "/login-proxy/",
    'register': "/users/",
    "current-user": "/users/current-user/",
    'dish-detail':  (foodId) => `/dishes/${foodId}/`,
    'dish-reviews': (foodId) => `/dishes/${foodId}/reviews/`,
    'reservations': "/reservations/",
    'orders':       '/orders/',
    'order-detail': (orderId) => `/orders/${orderId}/`,
    'order-pay':    (id) => `/orders/${id}/pay/`,
    'ingredients': '/ingredients/',
    'stats-dish':    '/stats/dish_stats/',
    'stats-revenue': '/stats/revenue_by_day/',
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
