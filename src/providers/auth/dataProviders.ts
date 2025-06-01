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
type refreshParams = {
    resource: string,
}

axios.defaults.baseURL = "http://localhost:3000/api";

const dataProvider = {
    register: async ({resource, values}: registerParams) => {
        const { data } = await axios.post(`${resource}`, values);
        return data;
    },
    login: async ({resource, values}: loginParams) => {
        const { data } = await axios.post(`${resource}`, values);
        return data;
    },
    refreshToken: async ({resource}: refreshParams) => {
        const { data } = await apiClient.post(`${resource}`, {})
        return data;
    }
}
export const { register, login, refreshToken } = dataProvider;

