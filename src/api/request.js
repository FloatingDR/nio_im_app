import axios from 'axios';
import router from "@/router";
import {Notify} from 'vant';

const baseURL = 'http://192.168.0.103:8080';

function resolveErrorCode(res) {
    const {status} = res;
    if (status === 401 || status === 403) {
        if (status === 401) {
            removeToken()
        }
        router.push({path: '/', replace: true})
            .then(r => console.log(r));
    }

}

function removeToken() {
    sessionStorage.removeItem('Authorization')
}

const request = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    }
});

request.interceptors.request.use(
    config => {
        // 如果有认证信息
        let authorization = sessionStorage.getItem('Authorization');
        if (authorization && authorization !== '') {
            config.headers['Authorization'] = authorization;
        }
        return config
    },
    error => {
        console.log(error);
        return Promise.reject(error);
    }
);

request.interceptors.response.use(
    res => {
        if (res.status && res.status !== 200) {
            resolveErrorCode(res);
        }
        // 警告弹出框，提示错误信息
        if (res.data.status === false) {
            Notify({
                message: `${res.data.message}`,
                type: 'warning',
            });
            return Promise.reject(new Error(res.data.message))
        }
        return res;
    },
    err => {
        const {response} = err;
        if (response.data.status) {
            Notify({
                message: `${response.data.message}`,
                type: 'warning',
            });
        }
        resolveErrorCode(response);
        return Promise.reject(err)
    }
);

export {request};

