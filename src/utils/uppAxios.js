import Axios from 'axios';
import qs from 'qs';
import cookie from './cookie';
import globalConfig from '../config/config';
import { message } from 'antd';

// 刷新token，再次发送请求 封装axios,添加拦截器
// 刷新token
let refeshToken = (axios, p1, p2, p3) => {
    const refresh_token = cookie.getCookie("refresh_token"),
        data = {
            "refresh_token": refresh_token,
            "grant_type": "refresh_token",
            "client_id": "app",
            "client_secret": "app"
        }
    axios({
        method: 'post',
        url: globalConfig.ApiUrl + "/oauth/token",
        data: qs.stringify(data),
        headers: {
            "Content-Type": 'application/x-www-form-urlencoded'
        }
    })
        .then(function (response) {
            if (response.status === 200) {
                cookie.setCookie('token', response.data.access_token); //设置新的token
                cookie.setCookie('refresh_token', response.data.refresh_token); //设置新的refresh_token
                p1.headers = {
                    Authorization: 'Bearer ' + response.data.access_token
                }
                UPPAxios(p1, p2, p3); //再次执行之前状态为401的请求
            }
        })
        .catch(function (error) {
            if (error.response && error.response.status === 400) {
                cookie.removeCookie('token');
                cookie.removeCookie('refresh_token');
                cookie.removeCookie("account");

            }
            // 如果没有refresh_token 说明用户登录超时
            if (!cookie.getCookie('refresh_token')) {
                window.location.href = cookie.getCookie('login_address');
            }
            console.log(error);
        });
}
//发送axios请求
let axiosFn = (axios, requestObj, responeCall, errorCall) => {
    const token = cookie.getCookie('token');
    //是否委托登录
    const hasDelegation = requestObj.url.indexOf("delegation") > -1 ? true : false;

    //给http请求添加Authorization
    if (token && !hasDelegation) { //排除登录api
        requestObj.headers = {
            Authorization: 'Bearer ' + token
        }
    }
    axios(requestObj)
        .then(function (response) {
            responeCall && responeCall(response);
        })
        .catch(function (error) {
            errorCall && errorCall(error);
            console.log(error);
        });
};
//二次封装axios
const UPPAxios = (obj, successCall, errorCall) => {
    let axios = Axios.create();
    // 请求时的拦截
    axios
        .interceptors
        .request
        .use(function (config) {
            // 发送请求之前做一些处理
            return config;
        }, function (error) {
            // 当请求异常时做一些处理
            return Promise.reject(error);
        });
    // 响应时的拦截
    axios
        .interceptors
        .response
        .use(function (response) {
            // 返回响应时做一些处理
            return response;
        }, function (error) {
            // 当响应异常时做一些处理
            if (error.response && error.response.status == 401) { //当返回状态为401时，刷新token
                //refeshToken(axios,obj, successCall,errorCall);
                let reToken = (successCall, errorCall) => {
                    refeshToken(axios, obj, successCall, errorCall);
                }
                return new Promise(reToken);

            }
            return Promise.reject(error);
        });

    axiosFn(axios, obj, successCall, errorCall);
}

const ajaxFn = function (url, data, method = 'post', type) {
    let funTemp = (successFn, errorFn) => {
        UPPAxios({
            method: method,
            url: (type == 1 ? globalConfig.url : globalConfig.ApiUrl) + url,
            data: data,
        }, (response) => {
            if (response.status === 200) {
                // if(response.data.result.isSuccess){
                //     successFn(response.data);
                // }
                // else{
                //     errorFn(response.data);
                // }         
                successFn(response.data);
            }
        }, (error) => {
            if (error.response && error.response.data && error.response.data.error && error.response.data.error.message && error.response.data.error.message == "未登录") {
                message.error("用户未登录或登录超时")
                window.location = cookie.getCookie('login_address')
            }
            errorFn(error.response ? error.response.data : error);
        });
    }
    return new Promise(funTemp);
}

// 用于 课程 / 考试 , url 为 全路径  
const ajaxFnUrl = function (url, data, method = 'post') {
    let funTemp = (successFn, errorFn) => {
        UPPAxios({
            method: method,
            url: url,
            data: data,
        }, (response) => {
            if (response.status === 200) {
                // if(response.data.result.isSuccess){
                //     successFn(response.data);
                // }
                // else{
                //     errorFn(response.data);
                // }         
                successFn(response.data);
            }
        }, (error) => {
            if (error.response && error.response.data && error.response.data.error && error.response.data.error.message && error.response.data.error.message == "未登录") {
                message.error("用户未登录或登录超时")
                window.location = cookie.getCookie('login_address')
            }
            errorFn(error.response ? error.response.data : error);
        });
    }
    return new Promise(funTemp);
}

export { UPPAxios, ajaxFn , ajaxFnUrl}
