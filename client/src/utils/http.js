import axios from 'axios';
import {toast} from 'react-toastify';

const http = axios.create();

http.defaults.baseURL = "http://localhost:5000"
http.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

http.interceptors.request.use(
    async(config)=>{
        const authToken = await localStorage.getItem('authToken');
        if(authToken){
            config.headers.common['Authorization'] = `jwt ${authToken}`
        }
        return config;
    },
    (error)=> Promise.reject(error)
);

http.interceptors.response.use(
    (response)=>{
        return response
    },
    (error)=>{
        if(error.response.status === 401){
            localStorage.clear()
            window.location.href('/')
        }
        else{
            toast.error("Network Error Occured. Please try again")
        }
    }

);

export default http;