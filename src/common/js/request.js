import axios from 'axios';
import configFile from "./config"


axios.defaults.timeout = 5000;
//填写域名
axios.defaults.baseURL = `${configFile.SOURCE_URL}`  

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

axios.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

//响应拦截器即异常处理
axios.interceptors.response.use(response => {
    if (response.status !== 200) {
        return Promise.reject(response.data)
    }
    return Promise.resolve(response.data)
}, err => {
    return Promise.reject(err.response)
})

const http = {
    /**
     * post 请求
    */
    post (url, data) {
        return new Promise((resolve, reject) => {
            axios.post(url, data).then(res => {
                if(res.code == 1) {
                    resolve(res.data)
                }else{
                    reject(res)
                }
            }).catch(err => {
                reject(err)
            })
        })
    },
}

export { http }