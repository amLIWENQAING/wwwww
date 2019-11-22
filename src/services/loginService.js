import globalConfig from '../config/config';
import cookie from '../utils/cookie';
import {UPPAxios,ajaxFn} from '../utils/uppAxios';
import qs from 'qs';
import {assign,map} from 'lodash';
import {GlobalEventer} from '../utils/EventDispatcher';
import {eventConfig} from  '../config/gloableEventConfig';

const accountService = (loginInfo, tenant, delegation,PUserId,PTenantId, callBack, errorFn) => {
    
    UPPAxios({
        method: 'post',
        // url: globalConfig.ApiUrl + "/oauth/token" 
        //     + (tenant != ""? "?tenant=" + tenant: "?tenant=")
        //     + ("&PUserId="+(PUserId))
        //     //+ (delegation != ""?"&delegation=" + delegation+"&userId="+cookie.getCookie('userId'): ""),
        //     + (delegation != ""?"&delegation=" + delegation+"&userId=2": "")
        //     + ("&PTenantId="+ PTenantId),

        url: globalConfig.ApiUrl + "/oauth/token" 
        + (tenant != ""? "?tenant=" + tenant: "?tenant=")
        + ("&PUserId="+(PUserId))
        + (delegation != ""?"&delegation=" + delegation: "")
        + ("&PTenantId="+ PTenantId ),
        
        data: qs.stringify(loginInfo),
        headers: {
            "Content-Type": 'application/x-www-form-urlencoded'
        }
    }, (response) => {
        if (response.status === 200) {
            if (cookie.getCookie('remember')) {
                cookie.setCookie('token', response.data.access_token);
                cookie.removeCookie('remember');
            } else {
                cookie.setCookie('token', response.data.access_token);
                cookie.setCookie('refresh_token', response.data.refresh_token);
            }
            callBack(true);
        } else {
            cookie.removeCookie('token');
            cookie.removeCookie("account");
            callBack(false);
        }
    }, (error) => {
        errorFn&&errorFn(error);
    })
}

const getCurrentLoginInformationService = ()=>{
    let url = '/api/services/app/uppAccount/GetCurrentUppAccountParty';
    return ajaxFn(url,{});
}

const getAccountInfo =(item)=>{

    let tenant  = '001';//r.result.parties[i].tenantName;
    let delegation = true;
    let PUserId  = item.tenantUserID == null  ?  '' : item.tenantUserID;
    let PTenantId  = item.tenantID  || '';

    let data= {
        tenant:tenant,
        delegation:delegation,
        PUserId:PUserId,
        PTenantId:PTenantId,
        tenantName: item.tenantName,
        // channelId: item.channelId,
        organizationId:item.organizationId || '',  // 机构id
        specialistTenantId: item.tenantID || '',
    }
    return data;
}

const getCurrentMenu =()=>{
    let url = '/api/services/app/navigation/GetUserMenus';
    return ajaxFn(url,{});
}

const getUserToolMenus =()=>{
    let url = '/api/services/app/navigation/GetUserToolMenus';
    return ajaxFn(url,{});
}

//     登录过程 :
//                        是否是  用户        ,若不是 则登录错误
//                        是否拥有 与 登录地址 对应的 身份 ,若没有 则登录错误
//                        整理 用户身份  与 登录信息
//                        获得token
//                        到 spining
//     spinning 页面过程： 
//                        用户是否 处于 审核 状态  , 若审核中 则到审核中提示页面
//                        审核通过的 继续到  获得 菜单信息 
//     最后加载 app  页面  

const loginService =  (data,accountServiceSuccess, accountServiceError,userData,roomId)=>{
    let url = '/api/Account?r='+Math.random(10);

    let accountState  = {};

    let loginSuccess = ()=>{   
        try {
            accountServiceSuccess(null,accountState);

            GlobalEventer.eventer.dispatchAll(eventConfig.GetCurrentUserSiteInfo_Success,'');
            getAllSiteInfo()
            .then(r=>{  
                if(r.result.siteId){
                    var data={};
                    data.siteId = r.result.siteId;
                    data.hostPortUrl = r.result.hostPortUrl;//域名到端口
                    data.siteServerUrl = r.result.siteServerUrl;//绑定的完整站点
                    data.showWebUrl = r.result.showWebUrl;
                    GlobalEventer.eventer.dispatchAll(eventConfig.GetCurrentUserSiteInfo_Success,data);
                }
            })
            .catch(error=>{
            });

        }
        catch(error){
            console.log(error);
        }  
        
    }

    ajaxFn(url,data)
    .then(r=>{
        cookie.setCookie('token',r.result);
        cookie.setCookie('login_address','/login');
        getCurrentLoginInformationService()
        .then(r=>{     
            GlobalEventer.eventer.dispatchAll(eventConfig.GetCurrentUserPaties_Success,r.result);

            let accountInfo = {};
            
            let loginInfo = {
                "username": data.usernameOrPhone,
                "password": data.password,
                "grant_type": "password",
                "client_id": "app",
                "client_secret": "app"
            };

            for(let i=0;i<r.result.parties.length; i++){
                // 根据parties 信息,  获得当前登录人  的 身份 信息
                let accountInfoData = getAccountInfo(r.result.parties[i]);
                accountInfo = assign({},accountInfo,accountInfoData); 
            }

            let reportchannelId =r.result.parties[0].channelId;
            cookie.setCookie('reportchannelId', reportchannelId);
            
            if (accountInfo.tenant) {
                accountService(
                    loginInfo,accountInfo.tenant,
                    accountInfo.delegation,
                    accountInfo.PUserId,
                    accountInfo.PTenantId,
                    loginSuccess, 
                    accountServiceError);
            } else {
                accountServiceError({error:{message:'该用户名不存在'}});
            }
        })
        .catch(error=>{
            accountServiceError(error);
        });

       
    })
    .catch(error=>{
        accountServiceError(error);
    });
}

let hasExpectIdentity=(userParties,parties )=>{
    for(let i  =0;i<parties.length;i++){
        for(let j=0;j< userParties.length;j++){
            if(parties[i] == userParties[j]){
                return true;
            }
        }
    }
    return false;
}

const getCurrentUserInfo  = (data)=>{
    let url  = '/api/services/app/session/GetCurrentLoginInformations';
    return ajaxFn(url,data); 
}

const getCurrentUserparties = (data) => {
    let url = '/api/services/app/user/GetCurrentUppAccountParty';
    return ajaxFn(url,data)
}

const getAllSiteInfo = () => {
    let url ='/api/services/Upp/businessInfo/GetAllSiteInfo';
    return ajaxFn(url, {}, 'post');
}


export {loginService,getCurrentMenu,getUserToolMenus,accountService, getCurrentLoginInformationService, getAccountInfo,getCurrentUserInfo ,getCurrentUserparties}