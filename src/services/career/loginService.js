import globalConfig from '../../config/config';
import cookie from '../../utils/cookie';
import { UPPAxios, ajaxFn } from '../../utils/uppAxios';
import qs from 'qs';
import { assign, map, filter } from 'lodash';
import { GlobalEventer } from '../../utils/EventDispatcher';
import { eventConfig } from '../../config/gloableEventConfig';
import { async } from 'q';

const accountService = (loginInfo, tenant, delegation, PUserId, PTenantId, callBack, errorFn) => {

    UPPAxios({
        method: 'post',
        // url: globalConfig.ApiUrl + "/oauth/token" 
        //     + (tenant != ""? "?tenant=" + tenant: "?tenant=")
        //     + ("&PUserId="+(PUserId))
        //     //+ (delegation != ""?"&delegation=" + delegation+"&userId="+cookie.getCookie('userId'): ""),
        //     + (delegation != ""?"&delegation=" + delegation+"&userId=2": "")
        //     + ("&PTenantId="+ PTenantId),

        url: globalConfig.ApiUrl + "/oauth/token"
            + (tenant != "" ? "?tenant=" + tenant : "?tenant=")
            + ("&PUserId=" + (PUserId))
            + (delegation != "" ? "&delegation=" + delegation : "")
            + ("&PTenantId=" + PTenantId),

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
        errorFn && errorFn(error);
    })
}

// 获得 课程 部分 使用 的 userInfo 
const getCourseUserInfo  = (data)=>{
    let url = '/api/services/Upp/equipmentApiTools/GetUserInfos';
    return ajaxFn(url,data);
}

const getCurrentLoginInformationService = () => {
    let url = '/api/services/app/uppAccount/GetCurrentUppAccountParty';
    return ajaxFn(url, {});
}
const GetCanChangeCurrentParty = (data) => {
    let url = '/api/services/app/user/GetCanChangeCurrentParty';
    return ajaxFn(url,data)
}

const getAccountInfo = (item) => {

    let tenant = '001';//r.result.parties[i].tenantName;
    let delegation = true;
    let PUserId = item.tenantUserID == null ? '' : item.tenantUserID;
    let PTenantId = item.tenantID || '';

    let data = {
        tenant: tenant,
        delegation: delegation,
        PUserId: PUserId,
        PTenantId: PTenantId,
        tenantName: item.tenantName,
        // channelId: item.channelId,
        organizationId: item.organizationId || '',  // 机构id
        specialistTenantId: item.tenantID || '',
    }
    return data;
}

const getAllSiteInfo = () => {
    let url ='/api/services/Upp/businessInfo/GetAllSiteInfo';
    return ajaxFn(url, {}, 'post');
}


const getCurrentMenu = () => {
    let url = '/api/services/app/navigation/GetUserMenus';
    return ajaxFn(url, {});
}

const getUserToolMenus = () => {
    let url = '/api/services/app/navigation/GetUserToolMenus';
    return ajaxFn(url, {});
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

// const loginService = (data, accountServiceSuccess, accountServiceError, userData, roomId) => {
//     let url = '/api/Account?r=' + Math.random(10);
//     let accountState = {};

//     let loginSuccess = () => {
//         try {
//             accountServiceSuccess(null, accountState);
//             // 管理员无Site
//             if (userData.history.CurrentUserParties.uppAccount.userName !== 'Administrator') {
//                 GlobalEventer.eventer.dispatchAll(eventConfig.GetCurrentUserSiteInfo_Success, '');
//                 getAllSiteInfo()
//                 .then(r=>{  
//                     if(r.result.siteId){
//                         var data={};
//                         data.siteId = r.result.siteId;
//                         data.hostPortUrl = r.result.hostPortUrl;//域名到端口
//                         data.siteServerUrl = r.result.siteServerUrl;//绑定的完整站点
//                         GlobalEventer.eventer.dispatchAll(eventConfig.GetCurrentUserSiteInfo_Success,data);
//                     }
//                 })
//                 .catch(error => {
//                 });
//             }


//         }
//         catch (error) {
//             console.log(error);
//         }

//     }

//     ajaxFn(url, data)
//         .then(r => {
//             cookie.setCookie('token', r.result);
//             cookie.setCookie('login_address', '/login');
//             getCurrentLoginInformationService()
//                 .then( async r => {
//                     GlobalEventer.eventer.dispatchAll(eventConfig.GetCurrentUserPaties_Success, r.result);

//                     // 用于 课程 获得 用户 信息
//                     let getCourseUserInfoResut = await getCourseUserInfo({ userId: r.result.parties[0].tenantUserID});
//                     GlobalEventer.eventer.dispatchAll(eventConfig.GetCouseUserInfo_Success, getCourseUserInfoResut.result.data);
    
//                     let accountInfo = {};

//                     let loginInfo = {
//                         "username": data.usernameOrPhone,
//                         "password": data.password,
//                         "grant_type": "password",
//                         "client_id": "app",
//                         "client_secret": "app"
//                     };

//                     for (let i = 0; i < r.result.parties.length; i++) {
//                         // 根据parties 信息,  获得当前登录人  的 身份 信息
//                         let accountInfoData = getAccountInfo(r.result.parties[i]);
//                         accountInfo = assign({}, accountInfo, accountInfoData);
//                     }

//                     let reportchannelId = r.result.parties[0].channelId;
//                     cookie.setCookie('reportchannelId', reportchannelId);

//                     if (accountInfo.tenant) {
//                         accountService(
//                             loginInfo, accountInfo.tenant,
//                             accountInfo.delegation,
//                             accountInfo.PUserId,
//                             accountInfo.PTenantId,
//                             loginSuccess,
//                             accountServiceError);
//                     } else {
//                         accountServiceError({ error: { message: '该用户名不存在' } });
//                     }
//                 })
//                 .catch(error => {
//                     accountServiceError(error);
//                 });


//         })
//         .catch(error => {
//             accountServiceError(error);
//         });
// }


const loginService = (data, accountServiceSuccess, accountServiceError,goSelectRole, userData) => {
    let url = '/api/Account?r=' + Math.random(10);
    let accountState = {};

    let loginSuccess = () => {
        try {            

            accountServiceSuccess(null, accountState);

            // 管理员无Site
            if (userData.history.CurrentUserParties.uppAccount.userName !== 'Administrator') {
                GlobalEventer.eventer.dispatchAll(eventConfig.GetCurrentUserSiteInfo_Success, '');
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
                .catch(error => {
                });
            }

        }
        catch (error) {
            console.log(error);
        }

    }

    ajaxFn(url, data)
        .then(r => {
            cookie.setCookie('token', r.result);
            cookie.setCookie('login_address', '/login');
            getCurrentLoginInformationService()
                .then(async r => {
                    GlobalEventer.eventer.dispatchAll(eventConfig.GetCurrentUserPaties_Success, r.result);
                    r.result.parties = r.result.parties.filter(function(o) { return o.partyIdentityCardType != 24})
                    // 账户类型选择
                    if (!(r.result.parties.length==1&&r.result.parties[0].partyList.length==1)) {
                        goSelectRole(r.result.parties);
                        return;
                    }
                    r.result.uppAccount.name = r.result.parties[0].partyList[0].tenantUserName;
                    GlobalEventer.eventer.dispatchAll(eventConfig.GetCurrentUserPaties_Success, r.result);
                    // 用于 课程 获得 用户 信息
                    let getCourseUserInfoResut = await getCourseUserInfo({ userId: r.result.parties[0].partyList[0].tenantUserID});
                    GlobalEventer.eventer.dispatchAll(eventConfig.GetCouseUserInfo_Success, getCourseUserInfoResut.result.data);
    
                    let accountInfo = {};

                    let loginInfo = {
                        "username": data.usernameOrPhone,
                        "password": data.password,
                        "grant_type": "password",
                        "client_id": "app",
                        "client_secret": "app"
                    };

                    // for (let i = 0; i < r.result.parties.length; i++) {
                        // 根据parties 信息,  获得当前登录人  的 身份 信息
                        let accountInfoData = getAccountInfo(r.result.parties[0].partyList[0]);
                        accountInfo = assign({}, accountInfo, accountInfoData);
                    // }

                    let reportchannelId = r.result.parties[0].partyList[0].channelId;
                    cookie.setCookie('reportchannelId', reportchannelId);

                    if (accountInfo.tenant) {
                        accountService(
                            loginInfo,
                            accountInfo.tenant,
                            accountInfo.delegation,
                            accountInfo.PUserId,
                            accountInfo.PTenantId,
                            loginSuccess,
                            accountServiceError);
                    } else {
                        accountServiceError({ error: { message: '该用户名不存在' } });
                    }
                })
                .catch(error => {
                    accountServiceError(error);
                });


        })
        .catch(error => {
            accountServiceError(error);
        });
}
let hasExpectIdentity = (userParties, parties) => {
    for (let i = 0; i < parties.length; i++) {
        for (let j = 0; j < userParties.length; j++) {
            if (parties[i] == userParties[j]) {
                return true;
            }
        }
    }
    return false;
}

const getCurrentUserInfo = (data) => {
    let url = '/api/services/app/session/GetCurrentLoginInformations';
    return ajaxFn(url, data);
}

const getCurrentUserparties = (data) => {
    //let url = '/api/services/app/user/GetCurrentUppAccountParty';
    let url = '/api/services/app/user/GetCurrentUserLoginParty';
    return ajaxFn(url, data)
}



const GetSiteInfo = () => {
    let url = '/api/services/Upp/businessInfo/GetSiteInfo';
    return ajaxFn(url, {}, 'post');
}

const getRoleArr = (parties) => {
    let loginInfo = {
        "username": '',
        "password": '',
        "grant_type": "password",
        "client_id": "app",
        "client_secret": "app"
    };

    let platAdminPaties = [1, 2]; //平台管理
    let orgAdminPaties = [3, 4]; //机构管理
    let hospitalAdminPaties = [5, 6, 7, 8]; //医院管理
    let channelAdminPaties = [12, 13]; // 渠道管理
    let doctorPaties = [10]; // 医生
    let specialistPaties = [9]; // 专家    
    let medicalPaties = [11, 15]; //医政
    let patientPaties = [14]; //患者

    let orgRoleArr = [];
    let orgAccountState = {};

    let specialistRoleArr = [];
    let specialistAccountState = {};

    let doctorRoleArr = [];
    let doctorAccountState = {};

    let medicalAdminRoleArr = [];
    let medicalAccountState = {};
    let currentHospitalId = cookie.getCookie('currentHospitalId');
    for (let i = 0; i < parties.result.parties.length; i++) {
        if (currentHospitalId && currentHospitalId == parties.result.parties[i].tenantID) {
            cookie.setCookie('currentHospital', parties.result.parties[i].tenantName);
        }
        let cardType = parties.result.parties[i].partyIdentityCardType;
        if (specialistPaties.indexOf(cardType) > -1) {
            specialistAccountState.userType = userTypeConfig.specialist;

            specialistRoleArr.push(getAccountInfo(parties.result.parties[i]));
        }
        else if (doctorPaties.indexOf(cardType) > -1) {
            doctorAccountState.userType = userTypeConfig.doctor;

            doctorRoleArr.push(getAccountInfo(parties.result.parties[i]));
        }
        else if (medicalPaties.indexOf(cardType) > -1) {
            medicalAccountState.userType = userTypeConfig.medicalAdmin;

            medicalAdminRoleArr.push(getAccountInfo(parties.result.parties[i]));
        }
    }

    let roleArr = [];

    if (orgRoleArr.length > 0) {
        roleArr.push({ roleTypeName: orgAccountState.userType, roleArr: orgRoleArr });
    }
    if (specialistRoleArr.length > 0) {
        roleArr.push({ roleTypeName: specialistAccountState.userType, roleArr: specialistRoleArr });
    }
    if (doctorRoleArr.length > 0) {
        roleArr.push({ roleTypeName: doctorAccountState.userType, roleArr: doctorRoleArr });
    }
    if (medicalAdminRoleArr.length > 0) {
        roleArr.push({ roleTypeName: medicalAccountState.userType, roleArr: medicalAdminRoleArr });
    }
    return roleArr
}


// 使用临时 token 获得 登录后的 token
const UserIdentityLogin = (data)=>{
    let url = '/api/services/app/uppNimIM/UserIdentityLogin';
    return ajaxFn(url,{userIdentityCache:data});
}

export { UserIdentityLogin,loginService, getCurrentMenu, getUserToolMenus, accountService, getCurrentLoginInformationService, getAccountInfo, getCurrentUserInfo,GetCanChangeCurrentParty, getCurrentUserparties,getCourseUserInfo, getRoleArr, getAllSiteInfo }