import axios from 'axios'

const SERVER_BASE = 'http://192.168.0.103:8080';

let http = axios.create();
http.interceptors.request.use(config => {
    if (sessionStorage.$token) {
        config.headers = {'Authorization': sessionStorage.$token}
    }
    return config
}, error => {
    return Promise.reject(error)
});

http.interceptors.response.use((data) => {
    return data
}, (err) => {
    console.log(err);
    return Promise.reject(err)
});

// 上传文件使用
let http_file=axios.create({
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});
http_file.interceptors.request.use(config => {
    return config
}, error => {
    return Promise.reject(error)
});

export {http, SERVER_BASE,http_file}
