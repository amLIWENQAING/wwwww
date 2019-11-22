import { message } from 'antd';
import { toPairs } from 'lodash';

const checkUnique = {
    //用户名验证
    checkUserName: () => {
        let timeout
        return { validator: (rule, value, callback) => { checkUnique.usernameCheck(rule, value, callback) } }
    },
    //用户名验证
    usernameCheck: (rule, value, callback) => {
        let reg = /^[0-9A-Za-z]{6,20}$/;
        if (value) {
            value = value + ''
            let value1 = value.trim()
            if (value.length == 0) {
                callback()
            } else if (value1 && value.indexOf(" ") != -1) {
                callback('请输入用户名，仅含字母和数字(6-20位)');
            } else if (value1 && value.length < 6) {
                callback('请输入用户名，仅含字母和数字(6-20位)');
            } else if (value1 && !reg.test(value)) {
                callback('请输入用户名，仅含字母和数字(6-20位)');
            } else if (value1 && reg.test(value)) {
                // commonService.userNameCheck(value).then(r => {
                //     if (r.success) {
                //         callback()
                //     } else {
                //         callback(r.error.message)
                //     }
                // }).catch(error => {
                //     console.log('错误信息', error)
                //     callback(error.error.message)
                // });
                callback()
            } else {
                callback()
            }
        } else {
            callback()
        }
    },
    //联系电话验证
    contactNumberCheck: (rule, value, callback) => {
        let reg = /^(\(\+8[6|7]\))?[1][3,4,5,6,7,8][0-9]{9}$/;
        // let re = /^0\d{2,3}-?\d{7,8}$/;
        let re = /^0\d{2,3}?\d{7,8}$/;
        if (value.length == 0) {
            callback();
        } else if (!reg.test(value) && !re.test(value)) {
            callback('电话号格式不正确!');
        } else {
            callback();
        }

    },
    //手机号验证
    telephoneCheck: (rule, value, callback) => {
        let reg = /^(\(\+8[6|7]\))?[1][3,4,5,6,7,8][0-9]{9}$/;
        if (value.length == 0) {
            callback();
        } else if (!reg.test(value)) {
            callback('联系电话格式不正确!');
        } else {
            callback();
        }

    },

    //电话验证
    checkPhone: (remoteCheckFun) => {
        let timeout
        return {
            validator: (rule, value, callback) => {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                const doValidator = () => {
                    if (value) {
                        value = value + ''
                        value = value.trim()
                        //pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
                        let reg = /^(\(\+8[6|7]\))?[1][3,4,5,6,7,8][0-9]{9}$/
                        if (value.length == 0) {
                            callback()
                        } else if (reg.test(value)) {
                            if (remoteCheckFun) {
                                remoteCheckFun(value, callback);
                            }
                            else {
                                callback()
                                // commonService.getPhoneCheck({ phone: value }).then(r => {
                                //     if (r.success) {
                                //         callback()
                                //     } else {
                                //         callback(r.error.message || '')
                                //     }
                                // }).catch(error => {
                                //     console.log('错误信息', error)
                                //     callback(error.error.message || '')
                                // });
                            }

                        } else {
                            callback('请输入正确手机号')
                        }
                    }
                    else {
                        callback()
                    }
                }
                timeout = setTimeout(doValidator, 10)
            }
        }
    },
    //appid
    appidCheck: (rule, value, callback) => {
        let reg = /^[A-Za-z0-9]+$/;
        if (!value) {
            callback();
        } else if (!reg.test(value)) {
            callback('格式不正确!');
        } else {
            callback();
        }

    },
    // 年龄验证
    ageCheck: (rule, value, callback) => {
        let reg = /^(?:[1-9][0-9]?|1[01][0-9]|120)$/;
        if (!value) {
            callback();
        } else if (!reg.test(value)) {
            callback('年龄格式不正确（1-120）!');
        } else {
            callback();
        }

    },
    // 正整数校验（包含0）
    positiveIntegerCheck: (rule, value, callback) => {
        let reg = /^([1-9]\d*|[0]{1,1})$/;
        if (!value) {
            callback();
        } else if (!reg.test(value)) {
            callback('请输入整数!');
        } else {
            callback();
        }
    },
    // 正整数校验（不包含0）
    positiveIntegerCheckNoZero: (rule, value, callback) => {
        let reg = /^([1-9]+\d*)$/;
        if (!value) {
            callback();
        } else if (!reg.test(value)) {
            callback('请输入大于0的整数!');
        } else {
            callback();
        }
    },
    // 站点URL校验
    SiteURLCheck: (rule, value, callback) => {
        let reg = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
        if (!value) {
            callback();
        } else if (!reg.test(value)) {
            callback('请输入正确的URL!（如：http://www.abc.cn或https://www.abc.cn）');
        } else {
            callback();
        }
    },
    //验证密码格式
    checkPassword: (rule, value, callback, confirmVal, form) => {
        var regStr = /([a-zA-Z0-9]|[`~!@#$%^&*()_+<>?:"{},.\/;'[\]=-])$/;
        var regCn = /([a-zA-Z0-9]|[·！#￥（——）：；“”‘、，\|《。》？、【】[\]])$/;
        // console.log(regCn.test(value),regStr.test(value))
        if (value) {
            let len = value.length;
            value = value.trim()
            if (value.length == 0) {
                callback();
            } else if (len != value.length) {
                callback('输入密码不能包含空格');
            } else if (value.length < 6) {
                callback('请输入6-16位密码(只能包含数字、英文大小写、特殊字符)');
            } else if (!regStr.test(value)) {
                callback('密码中只能包含数字、英文大小写、特殊字符');
            } else if (form && form.getFieldValue(confirmVal) && value != form.getFieldValue(confirmVal)) {
                callback('登录密码与确认密码不一致');
            } else if (form && form.getFieldValue(confirmVal) && value == form.getFieldValue(confirmVal)) {
                let errorArr = toPairs(form.getFieldError([confirmVal]))
                if (errorArr[0] && errorArr[0][1]) {
                    form.validateFields([confirmVal], { force: true });
                }
                callback()
            } else {
                callback()
            }
        } else {
            callback()
        }
    },
    //确认密码验证
    checkConfirmPassword: (rule, value, callback, password, form) => {
        var regStr = /([a-zA-Z0-9]|[`~!@#$%^&*()_+<>?:"{},.\/;'[\]=-])$/;
        if (value) {
            let len = value.length;
            value = value.trim();
            if (value.length == 0) {
                callback();
            } else if (len != value.length) {
                callback('输入密码不能包含空格');
            } else if (len < 6) {
                callback('请输入6-16位密码(只能包含数字、英文大小写、特殊字符)');
            } else if (!regStr.test(value)) {
                callback('密码中只能包含数字、英文大小写、特殊字符');
            } else if (form && form.getFieldValue(password) && value != form.getFieldValue(password)) {
                callback('登录密码与确认密码不一致');
            } else if (form && form.getFieldValue(password) && value == form.getFieldValue(password)) {
                let errorArr = toPairs(form.getFieldError([password]))
                if (errorArr[0] && errorArr[0][1]) {
                    form.validateFields([password], { force: true });
                }
                callback()
            } else {
                callback()
            }


        } else {
            callback()
        }
    },
    //图片验证
    PhotoCheck: (rule, value, callback, photoErro, isnull = false) => {
        if (photoErro) {
            callback('上传的图片大小不能超过5M');
            return;
        }
        // if ( (!rule.val || rule.val.length == 0)
        // && (!value || value.length == 0) ) {
        //     callback(rule.msg?rule.msg:'请上传图片');
        // } else {
        //     callback();
        // }
        if (isnull) {//非必填
            callback();
        }
        else {
            if ((!rule.val || rule.val.length == 0)) {
                callback(rule.msg ? rule.msg : '请上传图片');
            } else {
                callback();
            }
        }
    },
    //上传图片过滤
    beforeUpload: (file) => {
        let reg = new RegExp(/^image\/\jpeg|gif|jpg|png$/, 'i');
        if (reg.test(file.type)) {
            if (file.size / 1024 / 1024 <= 5) {
                return true;
            } else {
                message.info('上传文件过大');
                return false;
            }
        } else {
            message.error('图片格式不对');
            return false;
        }
    },
    /**
     * 上传图片触发事件
     *  photos  附件List信息
     *  photo   当前附件内容需要设置的state
     *  self    组件的state
     *  name    组件的name
     *  photoerror   上传附件出现错误需要设置的state
     */
    uploadChange: (photos, photo, self, name, photoerror) => {
        let pictures = [];
        let success = true;
        let photoErro = false;
        if (photos && photos.length > 0) {
            photos.map((item) => {
                if (item.status == "done") {
                    if (item.response && item.response.success) {
                        pictures.push(item.response.result.url);
                    } else {
                        pictures.push(item.name);
                    }
                } else if (item.status == 'error') {
                    success = false;
                    photoErro = true;
                }
            });
            if (photoErro) {
                let errorData = {};
                errorData[photoerror] = true;
                self.setState(errorData);
                return;
            }
            if (success) {
                let data = {};
                data[photoerror] = false;
                if (pictures.length > 0) {
                    data[photo] = pictures.toString();
                    self.setState(data);
                }
            }
        } else {
            let nameData = {};
            nameData[name] = '';
            if (self.form) {
                self.form.setFieldsValue(nameData);
            } else {
                self.props.form.setFieldsValue(nameData);
            }
            // this.form.resetFields(['picture']);            
            if (pictures.length > 0) {
                let data = {};
                data[photo] = pictures.toString();
                data[photoerror] = false;
                self.setState(data);
            }

        }
    },

    // 代理商，机构， 二级域名唯一性验证
    urlCheck: (service, structData) => {
        return {
            validator: (rule, value, callback) => {
                console.log(value)
                if (value) {
                    let len = value.length
                    value = value + ''
                    value = value.trim()
                    if (value.length == 0) {
                        callback()
                    }
                    if (len < 2) {
                        callback()
                    } else {
                        if (value == 'www') {
                            callback('该域名已存在')
                        }
                        // service(structData(value)).then(r => {
                        service(value).then(r => {
                            if (r.result.isSuccess) {
                                callback()
                            } else {
                                callback(r.result.message)
                            }
                        }).catch(error => {
                            console.log('错误信息', error)
                            callback(error.error.message)
                        });
                    }
                } else {
                    callback()
                }
            }
        }
    },
    //数字校验 0非零开头的整数（可有小数点后一位或两位的小树） callbackFunc:成功回调方法
    numCheck: (rule, value, callback, callbackFunc, callbackErrorFunc) => {
        if (value) {
            if (value.length == 0) {
                callback()
            }
            let reg = /^(0|[1-9][0-9]*)+(.[0-9]{1,2})?$/
            let reg1 = /^(0|[1-9][0-9]*)$/
            let value1 = value + '';
            let arr = value1.split('.');
            if (reg1.test(arr[0])) {
                if (reg.test(value)) {
                    if (value > 100000) {
                        callbackErrorFunc && callbackErrorFunc()
                        callback('小于100000的数字')
                    } else {
                        callbackFunc && callbackFunc()
                        callback();
                    }
                } else {
                    callbackErrorFunc && callbackErrorFunc()
                    callback("请输入(0、正整数或两位小数)");
                }
            } else {
                callbackErrorFunc && callbackErrorFunc()
                callback("请输入正确的数字");
            }
        } else {
            callback()
        }
    },

    //会诊使用 数字校验 0或非零开头的整数（可有小数点后一位或两位的小树）
    num1Check: (rule, value, callback, callbackFunc, callbackErrorFunc) => {
        if (value) {
            if (value.length == 0) {
                callback()
            }
            let reg = /^(0|[1-9][0-9]*)+(.[0-9]{1,2})?$/
            let reg1 = /^(0|[1-9][0-9]*)$/
            let value1 = value + '';
            let arr = value1.split('.');
            if (reg1.test(arr[0])) {
                if (reg.test(value)) {
                    if (value > 100000) {
                        callbackErrorFunc && callbackErrorFunc()
                        callback('小于100000的数字')
                    } else {
                        callbackFunc && callbackFunc()
                        callback();
                    }
                } else {
                    callbackErrorFunc && callbackErrorFunc()
                    callback("请输入(0、正整数或两位小数)");
                }
            } else {
                callbackErrorFunc && callbackErrorFunc()
                callback("请输入正确的数字");
            }
        } else {
            callback()
        }
    },
        // 小与一千万
    numberCheck: (rule, value, callback, callbackFunc, callbackErrorFunc) => {
        if (value) {
            if (value.length == 0) {
                callback()
            }
            let reg = /^(0|[1-9][0-9]*)+(.[0-9]{1,2})?$/
            let reg1 = /^(0|[1-9][0-9]*)$/
            let value1 = value + '';
            let arr = value1.split('.');
            if (reg1.test(arr[0])) {
                if (reg.test(value)) {
                    if (value > 10000000) {
                        callbackErrorFunc && callbackErrorFunc()
                        callback('采购金额不超过一千万')
                    } else {
                        callbackFunc && callbackFunc()
                        callback();
                    }
                } else {
                    callbackErrorFunc && callbackErrorFunc()
                    callback("请输入(0、正整数或两位小数)");
                }
            } else {
                callbackErrorFunc && callbackErrorFunc()
                callback("请输入正确的数字");
            }
        } else {
            callback()
        }
    },
    //平台设置会诊服务费平台机构比例
    countRatePrice: (rule, value, callback, callbackFunc, callbackError) => {
        if (value) {
            if (value.length == 0) {
                callback()
            }
            let reg = /^(0|[1-9][0-9]*)+(.[0-9]{1,2})?$/
            let reg1 = /^(0|[1-9][0-9]*)$/
            let val = value + '';
            let arr = val.split('.');
            if (reg1.test(arr[0])) {
                if (reg.test(value)) {
                    if (value > 100) {
                        callbackError && callbackError();
                        callback('请输入大于0,小于100的数字');
                    } else {
                        callbackFunc && callbackFunc();
                        callback();
                    }
                } else {
                    callbackError && callbackError();
                    callback("请输入(0、正整数或两位小数)");
                }
            } else {
                callbackError && callbackError();
                callback("请输入正确的数字");
            }
        } else {
            callback()
        }
    },
    //特殊字符
    specialChar: (value) => {
        var regStr = /[`~!@\#$%^&*()_+<>?:"{},.\/;'[\]=-]$/;
        var regCn = /[·！#￥（——）：；“”‘、，\|《。》？、【】[\]]$/;
        if (regStr.test(value)) {
            return false
        } else if (regCn.test(value)) {
            return false
        } else {
            return true
        }
    },
    //富文本验证
    editChenck: (rule, value, callback, ueEditor) => {
        let bi = ueEditor.getContent();
        let dd = bi.replace(/<\/?.+?>/g, "");
        dd = dd.replace(/ /g, "");
        // if (dd.length > 2000) {
        //     callback("简介内容不可超过2000个字符")
        // } else {
        //     callback()
        // }
        if (dd.length > 2000) {
            callback('简介内容不可超过2000个字符');
        } else {
            callback();
        }
    },

    // 上传文件类型验证
    checkCustomUploadType: (fileName, callback, errMsg, fileType = ['.p12']) => {
        if (fileName && fileName.length > 0) {
            var exName = fileName.substring(fileName.lastIndexOf('.'));
            if (fileType.indexOf(exName) >= 0) {
                callback();
            }
            else {
                callback(errMsg);
            }
        }
        else {
            callback(errMsg);
        }
    },

    // 验证附件是否上传成功方法
    checkUpload: (arr, state) => {
        for (let i = 0; i < arr.length; i++) {
            let data = state[arr[i]]
            if (data) {
                for (let j = 0; j < data.length; j++) {
                    if (data[j].status && data[j].status != 'done') {//uploading  done
                        return false;
                    }
                }
            }
        }
        return true;
    },

    //年龄验证
    haveSpace: (rule, value, callback) => {
        if (!value) {
            callback();
        } else if (value.indexOf(" ")>=0) {
            callback('不能包含空格');
        } else {
            callback();
        }

    },
}

export { checkUnique };