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
{/* Quên mật mật */}
export type ForgotPasswordForm = {
    email: string,
}
type ForgotParams = {
    resource: string,
    values: ForgotPasswordForm
}
{/* ResetPassword */}
export type ResetPasswordForm = {
    newPassword: string,
    token: string,
}
type ResetPasswordParams = {
    resource: string,
    values: ResetPasswordForm,
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
    forgotPassword: async({resource, values}: ForgotParams) => {
        const { data } = await axios.post(`${resource}`, values);
        return data;
    },
    resetPassword: async ({resource, values}: ResetPasswordParams) => {
        const { newPassword, token } = values; 
        const { data } = await axios.post(`${resource}`, { newPassword }, { params: {token} });
        return data;
    }
}
export const { register, login, forgotPassword, resetPassword } = authProvider;

