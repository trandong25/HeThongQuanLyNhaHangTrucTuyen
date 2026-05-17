import axios from "axios";

const BASE_URL = 'http://10.171.106.82:8000'
export const endpoints = {
    'categories': '/categories/',
    'dishes': '/dishes/',
    'current-user': '/users/current-user/'
}

export default axios.create({
    baseURL : BASE_URL
})