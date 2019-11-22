import {ajaxFn} from '../utils/uppAxios';

const commonService = { 
    //获取手机号重复 非平台
    getPhoneCheck : (data) => {
        let uid = data.uid ? '&uid=' + data.uid : '';
        let url = '/api/services/app/uppAccount/verifyUppAccountPhoneExist?phone=' + data.phone + uid;
        return ajaxFn(url , {});
    },
    // 用户名验证
    userNameCheck : (username) => {
        let url = '/api/services/app/uppAccount/verifyUppAccountUsernameExist?username=' + username;
        return ajaxFn(url , {});
    },
    getCode:(data) => {
        let url  = '/api/services/app/smsMessageService/SendRegisterCode';
        return ajaxFn(url,data,'post');
    },
    GatewayCustomerRegiste:(data) => {
        let url  = '/api/services/Upp/customerInfo/GatewayCustomerRegiste';
        return ajaxFn(url,data,'post');
    },
    getRoleNameCheck: (data) => {
        let url  = '/api/services/app/role/RoleNameIsUnique?name=' + data;
        return ajaxFn(url,{},'post');
    },
    checkRoleDisplayName: (data) => {
        let url  = '/api/services/app/role/RoleDisplayNameIsUnique?name=' + data;
        return ajaxFn(url,{},'post');
    },
    dominUrlCheck: (data) => {
        let url  = '/api/services/UPP/organizationInfo/VerificationDomianNameUnique?input=' + data;
        // let url  = '/api/services/UPP/organizationInfo/OrganizationDomainIsUnique'
        return ajaxFn(url,data,'post');
    },
    //个人设置 修改电话
    updateAccountPhone: (data) => {
        let url  = '/api/services/app/uppAccount/UpdateAccountPhoneNumberByUserId';
        return ajaxFn(url,data,'post');
    },
    //修改密码
    updateAccountPassword: (data) => {
        let url  = '/api/services/app/uppAccount/UpdateAccountPasswordByUserId';
        return ajaxFn(url,data,'post');
    },
    // 通过ID、域名和siteId设置域名与站点关联
    setSite: (data) => {
        let url  = '/api/services/app/siteService/Create';
        return ajaxFn(url,data,'post');
    },
    GetSiteId: (typeId) => {
        let url = '/api/services/UPP/hospitalInfo/GetSiteId?typeid=' + typeId;
        return ajaxFn(url, {}, 'post');
    },
    //按类型获取当前
    GetSiteName: (typeId) => {
        let url = '/api/services/UPP/hospitalInfo/GetSiteName?typeid=' + typeId;
        return ajaxFn(url, {}, 'post');
    },
    GetSiteAccessStr: (typeId) => {
        let url = '/api/services/app/siteService/GetSiteAccessStr';
        return ajaxFn(url, {}, 'post');
    },

        //获取级联关系根据个人信息类型
    getCascadingsByType: (data) => {
        let url = '/api/services/Upp/customerInfo/GetCascadingsByType';
        return ajaxFn(url, data, 'post');
    },
    // 平台端 （旧的 已过期）
    // adminGetPhoneCheck : (data) => {
    //     let uid = data.uid ? '&uid=' + data.uid : '';
    //     let url = '/api/services/app/user/verifyPlatformAdminUserPhoneExist?phone=' + data.phone + uid;
    //     return ajaxFn(url, {});
    // },
    // 平台端（旧的 已过期）
    // adminUserNameCheck : (username) => {
    //     let url = '/api/services/app/user/VerifyPlatformAdminUserNameExist?userName=' + username;
    //     return ajaxFn(url, {});
    // },
    //企业规模
    getInformationDemandEnterpriseSize : (data) => {
        let url = '/api/services/Upp/customerInfo/GetInformationDemandEnterpriseSize';
        return ajaxFn(url, data, 'post');
    },
    getAllSiteInfo : () => {
        let url ='/api/services/Upp/businessInfo/GetAllSiteInfo';
        return ajaxFn(url, {}, 'post');
    },
    InviteStudyIMLoginInformation : (data) => {
        let url ='/api/services/Upp/demandProject/InviteStudyIMLoginInformation';
        return ajaxFn(url, data, 'post');
    },
    GetBusinessWorks : (data) => {
        let url ='/api/services/Upp/businessInfo/GetBusinessWorks';
        return ajaxFn(url, data, 'post');
    },
    BusinessManActivityWork : (data) => {
        let url ='/api/services/Upp/activityNeeds/BusinessManActivityWork';
        return ajaxFn(url, data, 'post');
    },
    BusinessMantDemandWork : (data) => {
        let url ='/api/services/Upp/demandInfo/BusinessMantDemandWork';
        return ajaxFn(url, data, 'post');
    },
    BusinessMantPositionWork : (data) => {
        let url ='/api/services/Upp/positionInfo/BusinessMantPositionWork';
        return ajaxFn(url, data, 'post');
    },
    GetBusinessSettingDetails : (data) => {
        let url = '/api/services/Upp/businessInfo/GetBusinessSettingDetails';
        return ajaxFn(url, data, 'post');
    },
    UpdateBusinessSetting : (data) => {
        let url = '/api/services/Upp/businessInfo/UpdateBusinessSetting';
        return ajaxFn(url, data, 'post');
    },
}

export {commonService};
