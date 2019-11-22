// 使用 临时 token 进行登录
import React from 'react';
import {message} from 'antd';
import {UserIdentityLogin} from '../../services/career/loginService';
import cookie from '../../utils/cookie';
import { getMenu } from '../../utils/utilFun';

export default class TempLogin extends React.Component {
    constructor(props){
        super(props);
    }

    componentDidMount(){
        cookie.removeCookie('token');
        cookie.removeCookie('refresh_token');
        let self  = this;
        if(this.props.match.params.token){
            UserIdentityLogin( this.props.match.params.token ).then(r=>{
                cookie.setCookie('token',r.result.access_token);
                cookie.setCookie('refresh_token',r.result.refresh_token);

                getMenu(false, (url) => {
                    self.props.history.push(url);
                })
            })
            .catch(error=>{
                message.error('使用 临时 token 登录 失败');
            });
        }
    }

    render(){
        return <div>... 正在登录,请稍后</div>;
    }
}