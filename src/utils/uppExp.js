import Axios from 'axios';
import qs from 'qs';
import cookie from './cookie';
import globalConfig from '../config/config';
import { message } from 'antd';
import {UPPAxios} from "./uppAxios";
const ajaxExpFn = function (url, data,thefileName, baseUrl= globalConfig.examManageUrl) {

    let allUrl = '';
        allUrl = baseUrl + url;
    let funTemp = (successFn,errorFn)=>{
        UPPAxios({
            method: 'post',
            url: allUrl,
            data: data,
            responseType: 'blob'
        }, (res) => {
            const content = res.data;
            const blob = new Blob([content]);
            const fileName =thefileName;
            if ('download' in document.createElement('a')) { // 非IE下载
                const elink = document.createElement('a');
                elink.download = fileName;
                elink.style.display = 'none';
                elink.href = URL.createObjectURL(blob);
                document.body.appendChild(elink);
                elink.click();
                URL.revokeObjectURL(elink.href) ;// 释放URL 对象
                document.body.removeChild(elink)

            } else { // IE10+下载
                navigator.msSaveBlob(blob, fileName)
            }
            successFn();

            }, (error) => {
                if (error.response.data && error.response.data.error && error.response.data.error.message && error.response.data.error.message == "未登录") {
                    message.error("用户未登录或登录超时");
                    window.location = cookie.getCookie('login_address')
                }
                message.error("数据错误");
                errorFn(error.response.data);
        });
    }
    return new Promise(funTemp);
}
export {ajaxExpFn}