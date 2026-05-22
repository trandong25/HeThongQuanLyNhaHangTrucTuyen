import axios from "axios";
// Doi ip
const BASE_URL = "http://192.168.1.49:8000/";

export const endpoints = {
    'categories': '/categories/',
    'dishes': '/dishes/',
    'login': "/o/token/",
    'register': "/users/",
    "current-user": "/users/current-user/",
    'dish-detail':  (foodId) => `/dishes/${foodId}/`,
    'dish-reviews': (foodId) => `/dishes/${foodId}/reviews/`,
    'cart': "/cart/",
    'reservations': "/reservations/"

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
