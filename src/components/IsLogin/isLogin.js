import React from 'react';
import { Redirect } from 'react-router-dom';
import cookie from '../../utils/cookie';
import { getMenu } from '../../utils/utilFun';

export default class IsLogin extends React.Component {
    constructor(props){
        super(props);
    }

    componentDidMount() {

        // 刷新页面逻辑

        let token = cookie.getCookie('token');
        if(this.props.menuArr.length <1  && token){

            getMenu(false, (url) => {
                if (window.location.pathname) {
                    url = window.location.pathname;
                }
                
                //this.props.history.push(url);

                if( this.props.refreshMenu) {
                    this.props.refreshMenu();
                }
                
            })   
        }
    }

    render(){
        let token = cookie.getCookie('token');
        let isRefresh  = this.props.menuArr.length  <1;
        if(! isRefresh && token){
            //return <div>{this.props.children}</div>;
            return this.props.children;
        }
        else if (isRefresh && token){
            return <div></div>
        }
        else {
            return (<Redirect push to ='/login' />);
        }
    }
}