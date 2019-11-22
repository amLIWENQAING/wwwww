import React from 'react';
import {
    Form,
    Icon,
    Input,
    Button,
    Checkbox,
    message,
    List,
    Tag
} from 'antd';
import '../../content/css/adminLogin/main.css';
import { getMenu } from '../../utils/utilFun'
import { getAccountInfo, accountService, getCourseUserInfo, getAllSiteInfo } from '../../services/career/loginService'
import cookie from '../../utils/cookie';
import { assign } from 'lodash';
import { GlobalEventer } from '../../utils/EventDispatcher';
import { eventConfig } from '../../config/gloableEventConfig';
import { UPPModal } from '../../components/common/index';
// import img_logo from '../../content/img/logo.png';

import { loginService } from '../../services/career/loginService';
class adminLoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            loadingSecond: false,
            modalTitle: '',
            modalVisible: false,
            parties: [],
            values: {},
            selectedRole: {}
        }
        this.history = this.props.history;
        this.dispatch = this.props.dispatch;
    }

    componentWillMount() {
        cookie.removeCookie('token');
    }
    // 取消
    handleCancel = () => {
        this.setState({
            modalVisible: false,
            selectedRole: {},
            loading: false,
            index: '',
            key: '',
            loadingSecond: false
        });
    }
    // 选择账号类型
    selectedRole = (selectedRole, key, index) => {
        this.setState({
            index,
            key,
            selectedRole
        })
    }
    render() {
        const FormItem = Form.Item;
        const { getFieldDecorator } = this.props.form;
        const loading = this.state.loading;
        const modalInfo = {
            title: this.state.modalTitle,
            visible: this.state.modalVisible,
        }
        return (
            <div>
                <div style={{ fontSize: "28px", marginTop: "20px", marginLeft: "20px" }}>欢迎登录</div>
                <div className='div-header' >
                    {/* <div className="div-logo"></div> */}
                    {/* <div className="div-line"/> */}
                    {/* <div className='div-title'>欢迎登录</div> */}

                </div>
                <div className='div-middle'>
                    <div className='div-middle-middle'>
                        <div className='div-middle-left'></div>
                        <div className="div-login">
                            <div className='div-login-title'>
                                {/* <span>{this.props.name}</span> */}
                                <span>登录</span>
                            </div>
                            <Form className="login-form">
                                <FormItem>
                                    {getFieldDecorator('account', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入您的账号!'
                                            }
                                        ]
                                    })(
                                        <Input
                                            prefix={< Icon type="user" style={{ fontSize: 13 }} />}
                                            placeholder="账号" />
                                    )}
                                </FormItem>
                                <FormItem>
                                    {getFieldDecorator('password', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入您的密码!'
                                            }
                                        ]
                                    })(
                                        <Input
                                            prefix={< Icon type="lock" style={{ fontSize: 13 }} />}
                                            type="password"
                                            placeholder="密码" />
                                    )}
                                </FormItem>
                                <div style={{ height: '10px' }} />
                                <FormItem
                                    style={{
                                        width: '280px'
                                    }}>
                                    {getFieldDecorator('remember', {
                                        valuePropName: 'checked',
                                        initialValue: false
                                    })(
                                        <Checkbox>记住密码</Checkbox>
                                    )}
                                    <a className="login-form-forgot" href="" onClick={this.handleForgetPWSClick}>忘记密码</a>

                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="login-form-button"
                                        onClick={this.handleLoginClick}
                                        loading={loading}>
                                        {loading
                                            ? '登录中...'
                                            : '登录'}
                                    </Button>
                                    {/* <div
                                        style={{
                                        'float': 'right'
                                    }}>
                                        <a href="http://www.careerlink.com:8082/public/miPlatformFileTransferClient.exe">下载Dicom插件</a>
                                    </div> */}
                                    {/* <a className="login-form-forgot" href="" onClick={this.toRegister} style={{marginRight:'10px'}}>注册</a> */}
                                    <br />
                                </FormItem>
                            </Form>
                        </div>
                    </div>
                </div>
                {/* <UPPModal
                    width='800px'
                    modalInfo={modalInfo}
                    handleCancel={this.handleCancel}>
                    {(this.state.modalTitle == '选择账号类型') &&
                        <div>
                            <List
                                size="small"
                                // header={<div style={{ fontWeight: 'bold' }}>{}</div>}
                                // footer={<div>Footer</div>}
                                bordered
                                dataSource={this.state.parties}
                                renderItem={(item, key) => {
                                    return item.partyIdentityCardType != 24 && <List.Item>
                                        <div>
                                            <span style={{ marginRight: '30px', fontWeight: 'bold' }}>
                                                {item.partyIdentityCardTypeName}:
                                            </span>
                                            {item.partyList.map((iteminner, index) => {
                                                console.log(5555, iteminner)
                                                return <Tag color={this.state.key === key && this.state.index === index ? 'blue' : null} key={index} onClick={() => this.selectedRole(iteminner, key, index)}>{iteminner.viewPartyName}</Tag>
                                            })}
                                        </div>
                                    </List.Item>
                                }
                                }
                            />
                            <div style={{ marginTop: '10px', textAlign: 'right' }}>
                                <Button type='primary' style={{ marginRight: '10px' }} loading={this.state.loadingSecond} onClick={this.login}>确定</Button>
                                <Button onClick={this.handleCancel}>取消</Button>
                            </div>
                        </div>
                    }
                </UPPModal> */}

                <div className='div-bottom'>
                    {/* <span>版权所有 Copyright 2019辽ICP备12026857号辽（职链）网变审（2015）第10002号</span> */}
                    {/* <span>版权所有 Copyright © 2019 沈阳中睿教育有限公司. All Rights Reserved.</span> */}
                </div>
            </div>
        );
    }

    toRegister = () => {

    }
    // 选择账号类型后登陆
    login = async () => {
        if (Object.keys(this.state.selectedRole).length == 0) {
            message.warning('请选择账号类型');
            return
        }
        this.setState({
            loadingSecond: true,
            modalVisible: false
        })
        let userData = {
            history: this.props.history,
            data: {
                password: this.state.values.password,
                // host:host,
            }
        }


        // 将所选择账号复制给数组[0];因为用到的地方太多。后期可优化
        let { selectedRole, parties, key } = this.state;

        console.log(666, selectedRole)
        let data = userData.history.CurrentUserParties;
        data.uppAccount.name = selectedRole.tenantUserName;
        data.parties[0] = parties[key];
        GlobalEventer.eventer.dispatchAll(eventConfig.GetCurrentUserPaties_Success, data);

        let accountState = {};
        let loginSuccess = () => {
            try {
                this.accountServiceSuccess(null, accountState);
                // 管理员无Site
                if (userData.history.CurrentUserParties.uppAccount.userName !== 'Administrator') {
                    GlobalEventer.eventer.dispatchAll(eventConfig.GetCurrentUserSiteInfo_Success, '');
                    getAllSiteInfo()
                        .then(r => {
                            if (r.result.siteId) {
                                var data = {};
                                data.siteId = r.result.siteId;
                                data.hostPortUrl = r.result.hostPortUrl;//域名到端口
                                data.siteServerUrl = r.result.siteServerUrl;//绑定的完整站点
                                data.showWebUrl = r.result.showWebUrl;
                                GlobalEventer.eventer.dispatchAll(eventConfig.GetCurrentUserSiteInfo_Success, data);
                            }
                        }).catch(error => {
                        });
                }
            }
            catch (error) {
                console.log(error);
            }
        }

        // 用于 课程 获得 用户 信息
        let getCourseUserInfoResut = await getCourseUserInfo({ userId: this.state.selectedRole.tenantUserID });
        GlobalEventer.eventer.dispatchAll(eventConfig.GetCouseUserInfo_Success, getCourseUserInfoResut.result.data);

        let accountInfo = {};

        let loginInfo = {
            "username": this.state.values.account,
            "password": this.state.values.password,
            "grant_type": "password",
            "client_id": "app",
            "client_secret": "app"
        };

        // for (let i = 0; i < this.state.parties.length; i++) {
        // 根据parties 信息,  获得当前登录人  的 身份 信息
        let accountInfoData = getAccountInfo(this.state.selectedRole);
        accountInfo = assign({}, accountInfo, accountInfoData);
        // }

        let reportchannelId = this.state.selectedRole.channelId;
        cookie.setCookie('reportchannelId', reportchannelId);

        if (accountInfo.tenant) {
            accountService(
                loginInfo,
                accountInfo.tenant,
                accountInfo.delegation,
                accountInfo.PUserId,
                accountInfo.PTenantId,
                loginSuccess,
                this.accountServiceError);
        } else {
            this.accountServiceError({ error: { message: '该用户名不存在' } });
        }
    }
    accountServiceSuccess = (menus, accountState) => {

        // let UserID= this.props.history.CurrentUserParties.parties[0].tenantUserID;
        // 调用获取menu
        getMenu('CurrentUserParties' in this.props.history, (url) => {
            this.props.history.push(url);
        })
    }

    accountServiceError = (error) => {
        if (error && error.error && error.error.message) {
            message.error(error.error.message);
        }
        else {
            message.error('该用户名不存在');
        }
        cookie.removeCookie('refresh_token');
        cookie.removeCookie('token');
        this.setState(state => { state.loading = false; return state; });
    }
    goSelectRole = (data = []) => {
        // this.setState({
        //     modalTitle: '选择账号类型',
        //     modalVisible: true,
        //     parties: data
        // })
        this.setState({
            selectedRole:data[1].partyList[0]
        }, () => {
                this.login()
        })
    }
    handleLoginClick = (e) => {
        e.preventDefault();
        let self = this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    values: values
                })
                let loginInfo = {

                    usernameOrPhone: values.account,
                    password: values.password,
                };
                this.setState(state => { state.loading = true; return state; });

                let userData = {
                    history: this.props.history,
                    data: {
                        password: values.password,
                        // host:host,
                    }
                }

                loginService(loginInfo, self.accountServiceSuccess, self.accountServiceError, self.goSelectRole, userData);

                window.localStorage.setItem('loginUrl', window.location.pathname);
            }
        });
    }

    handleForgetPWSClick = () => {
        //this.props.history.push("/resetPassWord");
    }
}

const AdminLogin = Form.create()(adminLoginForm);

export default AdminLogin;