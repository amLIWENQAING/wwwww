
import { find, map } from 'lodash';
import { message } from 'antd';
import globalConfig from '../config/config';

export const fileChecker = {
    // /^image\/\jpeg|gif|jpg|png$/
    typeCheck: (typeReg, fileExtendNameReg, fileList, resovle = null, reject = null) => {
        let tempFun = (resovle, reject) => {
            let tempPassArr = [];
            for (let x in fileList) {

                let fileType = fileList[x].type;
                fileType = fileType || '';

                let fileName = '';
                let tempIndex = fileList[x].name.lastIndexOf('.');
                if (tempIndex > 0 && (tempIndex + 1) < fileList[x].name.length) {
                    fileName = fileList[x].name.substring(tempIndex + 1)
                }
                fileName = fileName || '';

                if (fileExtendNameReg.test(fileName) || typeReg.test(fileType)) {

                    tempPassArr.push(fileList[x]);
                }
            }
            if (tempPassArr.length == fileList.length && tempPassArr.length > 0) {
                if (resovle)
                    return resovle(tempPassArr);
                return tempPassArr;
            }
            else {
                if (reject)
                    return reject(tempPassArr);
                return tempPassArr;
            }
        }

        return tempFun(resovle, reject);
    },

    // fileSize 单位为 M
    sizeCheck: (fileSize, fileList, resolve, reject) => {
        let tempFun = (resolve, reject) => {
            let tempPassArr = [];
            for (let x in fileList) {
                // 当 没有说size 时，说明不是新上传的
                if (!fileList[x].size || fileList[x].size / 1024 / 1024 <= fileSize) {
                    tempPassArr.push(fileList[x]);
                }
            }
            if (tempPassArr.length == fileList.length && tempPassArr.length > 0) {
                if (resolve)
                    return resolve(tempPassArr);
                return tempPassArr;
            }
            else {
                if (reject)
                    return reject(tempPassArr);
                return tempPassArr;
            }
        }

        return tempFun(resolve, reject);
    },

    // 对上传结果 进行检查
    resultCheck: (fileList, resolve, reject) => {
        let tempResult = [];
        for (var x in fileList) {
            if (fileList[x].status == 'done') {
                if (fileList[x].response
                    && fileList[x].response.result
                    && fileList[x].response.result.state != -2) {

                    tempResult.push(fileList[x]);
                }
                else if (fileList[x].response
                    && fileList[x].response.result
                    && fileList[x].response.result.state == -2) {

                    message.error(fileList[x].response.result.errorMessage);

                }
                else {
                    tempResult.push(fileList[x]);
                }
            }
            else if (fileList[x].status == 'error') {
                message.error('上传文件出现错误');
            }
            else {
                tempResult.push(fileList[x]);
            }
        }

        if (tempResult.length == fileList.length) {
            if (resolve) {
                return resolve(tempResult);
            }
            else {
                return tempResult;
            }
        }
        else {
            if (reject) {
                return reject(tempResult);
            }
            else {
                return tempResult;
            }
        }
    },

    imgUploaderBeforeUpload: (file, typeReg = /^image\/jpeg|gif|jpg|png$/, fileNameExtendReg = /^jpeg|gif|jpg|png$/, fileSize = 5) => {

        let funList = [];
        let index = 0

        let resovleFun = () => {
            if (index < funList.length) {
                index++;
                return funList[index - 1]();
            }
        }

        funList.push(() => {
            let reject = () => {
                message.error('上传文件的文件格式不正确');
                return false;
            }
            return fileChecker.typeCheck(typeReg, fileNameExtendReg, [file], resovleFun, reject);
        })

        funList.push(() => {
            let reject = () => {
                message.error('上传的文件不能大于' + fileSize + 'M');
                return false;
            }
            return fileChecker.sizeCheck(fileSize, [file], resovleFun, reject);
        })

        return resovleFun();
    },

    imgUploadOnChange: (fileList, typeReg = /^image\/jpeg|gif|jpg|png$/, fileNameExtendReg = /^jpeg|gif|jpg|png$/, fileSize = 5) => {

        fileList = fileList || [];

        fileList = fileChecker.typeCheck(typeReg, fileNameExtendReg, fileList);

        fileList = fileChecker.sizeCheck(fileSize, fileList);

        return fileList;
    },

    // fileList 为字符串或者数组
    imgUploaderValue: (fileList) => {
        fileList = fileList || [];
        if (fileList.constructor.name == 'String') {
            return fileList;
        }
        else {
            let tempStr = '';
            map(fileList, x => {
                if (x.url) {
                    tempStr += x.url.replace(globalConfig.ApiUrl, '') + ',';
                }
                else if (x.response && x.response.result) {
                    tempStr += x.response.result.url.replace(globalConfig.ApiUrl, '') + ',';
                }

            })
            return tempStr.substring(0, tempStr.length - 1);
        }
    },

    // fileList 为字符串或者数组
    imgUploaderUrlAndName: (fileList) => {
        fileList = fileList || [];
        if (fileList.constructor.name == 'String') {
            return fileList;
        }
        else {
            let tempStr = [];
            map(fileList, x => {
                if (x.url) {
                    tempStr.push({
                        path: x.url.replace(globalConfig.ApiUrl, ''),
                        name: x.originFileName
                    });
                }
                else if (x.response && x.response.result) {
                    tempStr.push({
                        path: x.response.result.url.replace(globalConfig.ApiUrl, ''),
                        name: x.response.result.originFileName
                    });
                }

            })
            return tempStr;
        }
    },

    imgUploaderSubmitValidator: () => {

    },

    imgUploadValidator: (rule, value, callback) => {

    },

    fileUploaderBeforUpload: (file, typeReg = /^(image\/jpeg|gif|jpg|png)|(application\/x-zip-compressed)$/
        , fileNameExtendReg = /^jpeg|gif|jpg|png|doc|docx|xls|xlsx|txt|pdf$/, fileSize = 100) => {
        let funList = [];
        let index = 0

        let resovleFun = () => {
            if (index < funList.length) {
                index++;
                return funList[index - 1]();
            }
        }

        funList.push(() => {
            let reject = () => {
                message.error('上传文件的文件格式不正确');
                return false;
            }
            return fileChecker.typeCheck(typeReg, fileNameExtendReg, [file], resovleFun, reject);
        })

        funList.push(() => {
            let reject = () => {
                message.error('上传的文件不能大于' + fileSize + 'M');
                return false;
            }
            return fileChecker.sizeCheck(fileSize, [file], resovleFun, reject);
        })

        return resovleFun();
    },

    fileUploaderOnChange: (fileList, typeReg = /^(image\/jpeg|gif|jpg|png)|(application\/x-zip-compressed)$/,
        fileNameExtendReg = /^jpeg|gif|jpg|png|doc|docx|xls|xlsx|txt|pdf$/, fileSize = 50) => {

        fileList = fileList || [];

        fileList = fileChecker.typeCheck(typeReg, fileNameExtendReg, fileList);

        fileList = fileChecker.sizeCheck(fileSize, fileList);

        fileList = fileChecker.resultCheck(fileList);

        return fileList;
    },


    
    videoUploaderBeforUpload: (file, typeReg = /^(video\/mp4)$/
        , fileNameExtendReg = /^mp4$/, fileSize = 100) => {
        let funList = [];
        let index = 0

        let resovleFun = () => {
            if (index < funList.length) {
                index++;
                return funList[index - 1]();
            }
        }

        funList.push(() => {
            let reject = () => {
                message.error('上传文件的文件格式不正确');
                return false;
            }
            return fileChecker.typeCheck(typeReg, fileNameExtendReg, [file], resovleFun, reject);
        })

        funList.push(() => {
            let reject = () => {
                message.error('上传的文件不能大于' + fileSize + 'M');
                return false;
            }
            return fileChecker.sizeCheck(fileSize, [file], resovleFun, reject);
        })

        return resovleFun();
    },

    videoUploaderOnChange: (fileList, typeReg = /^(video\/mp4)$/,
        fileNameExtendReg = /^mp4$/, fileSize = 100) => {

        fileList = fileList || [];

        fileList = fileChecker.typeCheck(typeReg, fileNameExtendReg, fileList);

        fileList = fileChecker.sizeCheck(fileSize, fileList);

        fileList = fileChecker.resultCheck(fileList);

        return fileList;
    },
    fileUpLoaderValue: (fileList) => {
        fileList = fileList || [];
        if (fileList.constructor.name == 'String') {
            return fileList;
        }
        else {
            let tempArr = [];
            map(fileList, x => {
                if (x.response) {
                    tempArr.push({ name: x.response.result.originFileName, value: x.response.result.url })
                }
                else if (x.url) {
                    tempArr.push({ name: x.name, value: x.url.replace(globalConfig.ApiUrl, '') });
                }
                else {
                    tempArr.push(x);
                }

            })
            return JSON.stringify(tempArr);
        }
    }
}