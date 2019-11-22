// 使用 临时 token 进行登录
import React from 'react';
import {message} from 'antd';
import {UserIdentityLogin} from '../../services/career/loginService';
import cookie from '../../utils/cookie';
import { getMenu } from '../../utils/utilFun';

export default class TempLogin extends React.component {
    constructor(props){
        super(props);
    }

    componentDidMount(){
        if(this.props.match.params.token){
            UserIdentityLogin( window.decodeURIComponent(this.props.match.params.token) ).then(r=>{
                cookie.setCookie('token',r.result.access_token);
                cookie.setCookie('refresh_token',r.result.refresh_token);

                getMenu(false, (url) => {
                    this.router.history.push(url);
                })
            })
            .catch(error=>{
                message.error('使用 临时 token 登录 失败');
            });
        }
    }

    render(){
        return <div>... 加载中</div>;
    }
}