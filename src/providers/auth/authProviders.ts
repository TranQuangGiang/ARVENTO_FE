import axios from 'axios';

import apiClient from '../../hooks/refreshToken';


{/* Đăng ký */}
export type registerForm = {
    name: string,
    email: string,
    password: string,
}
type registerParams = {
    resource: string,
    values: registerForm,
}

{/* Đăng nhập */}
export type loginForm = {
    email: string,
    password: string,
}
type loginParams = {
    resource: string,
    values: loginForm
}


axios.defaults.baseURL = "http://localhost:3000/api";

const authProvider = {
    register: async ({resource, values}: registerParams) => {
        const { data } = await axios.post(`${resource}`, values);
        apiClient.defaults.headers.common["Authorization"] = "Bearer " + data?.data.access_token;
        return data;
    },
    login: async ({resource, values}: loginParams) => {
        const { data } = await axios.post(`${resource}`, values);
        return data;
    },
    
}
export const { register, login } = authProvider;

