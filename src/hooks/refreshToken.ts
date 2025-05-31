import axios from "axios";
import Cookies from 'js-cookie';

const apiClient = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true
});

apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem("token") || Cookies.get('token');
    if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error)
        }
        else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};
apiClient.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function(resolve, reject){
                    failedQueue.push({resolve, reject});
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer' + token;
                    return apiClient(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                }) 
            }

            originalRequest._retry = true;
            isRefreshing = true;
            try {
                const { data } = await apiClient.post(`/auth/refresh-token`);

                Cookies.set("token", data.access_token, { expires: 7 });
                localStorage.setItem("token", data.access_token);

                // cập nhập
                apiClient.defaults.headers.common['Authorization'] = 'Bearer' + data.access_token;
                originalRequest.headers['Authorization'] = 'Bearer' + data.access_token;

                processQueue(null, data.access_token);
                return apiClient(originalRequest);
            } catch (error) {
                processQueue(error, null);
                
                return Promise.reject(error);
            } finally {
                isRefreshing = false
            }
        }        
        
        return Promise.reject(error);
    }
    
);

const token = Cookies.get("token") || localStorage.getItem("token");
if(token) {
  apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}

export default apiClient;