import axios from "axios";
// Doi ip
const BASE_URL = "http://10.0.17.171:8000/";

export const endpoints = {
    'categories': '/categories/',
    'dishes': '/dishes/',
    'login': "/o/token/",
    'register': "/users/",
    "current-user": "/users/current-user/",
    'dish-detail':  (foodId) => `/dishes/${foodId}/`,
    'dish-reviews': (foodId) => `/dishes/${foodId}/reviews/`,
    'cart': "/cart/",
    'reservations': "/reservations/",
    'orders':       '/orders/',
    'order-pay':    (id) => `/orders/${id}/pay/`,
    "login-proxy": "/login-proxy/",

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
