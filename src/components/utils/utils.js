//import { urlConfig } from '../config/requestConfig';
export const utils = {
    rpx: (num) => {
        // let w  = Math.ceil(window.innerWidth/750) * num;
        let w = (window.innerWidth / 750).toFixed(2) * num;
        return w + 'px';
    },

    // getSiteServerImgUrl: (url) => {
    //     if (!url) {
    //         return '';
    //     } else {
    //         return urlConfig.siteServerApiUrl + url;
    //     }
    // },

    // getImgFullUrl: (url) => {
    //     if (!url) {
    //         return '';
    //     } else {
    //         return urlConfig.imgBaseUrl + url;
    //     }
    // },

    replaceRichText: (text) => {
        // return text.replace(new RegExp('宋体', "g"), "Microsoft YaHei").replace(new RegExp('<p', "g"), "<div").replace(new RegExp('</p>', "g"), "</div>").replace(new RegExp('<br/>', "g"), "");
        let newText = text.replace(new RegExp('宋体', "g"), "Microsoft YaHei,Heiti SC, SimSun").replace(new RegExp('<p', "g"), "<div").replace(new RegExp('</p>', "g"), "</div>");
        if (newText.indexOf('font-size') > -1) {
            newText = newText.replace(/font-size\s?:\s?\d*\s?px(;?)/, "");
        }

        while (true) {
            if ((newText.lastIndexOf("<br/>") === newText.length - 5) && (newText.length - 5 != -1)) {
                newText = newText.substr(0, newText.length - 5);
            }
            else {
                break;
            }
        }

        // newText = "<span style='font-size: 16px;'>" + newText + "</span>";
        newText = "<span>" + newText + "</span>";

        return newText;
    },

    getTag: (data) => {
        // console.log(data)
        let arr = [];

        data.gradeName && arr.push(data.gradeName);
        data.subjectName && arr.push(data.subjectName);
        data.editionName && arr.push(data.editionName);
        data.seriesName && arr.push(data.seriesName);
        data.subitemName && arr.push(data.subitemName);
        data.examTypeName && arr.push(data.examTypeName);
        return arr;
    },

    getCreateTime: (date, fmt) => {
        if (date) {
            date = new Date(date);
            let o = {
                "M+": date.getMonth() + 1,
                "d+": date.getDate(),
                "h+": date.getHours(),
                "m+": date.getMinutes(),
                "s+": date.getSeconds(),
                "q+": Math.floor((date.getMonth() + 3) / 3),
                "S": date.getMilliseconds()
            };
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (let k in o)
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }
        else {
            return "";
        }

    },

    iphoneXStyle: () => {
        if (/iphone/gi.test(navigator.userAgent) && (window.screen.height == 812 && window.screen.width == 375)) {
            return 20;
        } else {
            return 0;
        }
    }
}