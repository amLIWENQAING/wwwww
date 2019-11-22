import { ajaxFn } from '../../utils/uppAxios';

const projectOrderManagementService = {
    // 获取下拉数据
    GetCollectionBase: (data) => {
        let url = 'api/services/Upp/collection/GetCollectionBase';
        return ajaxFn(url, data);
    },
    // 供给侧根据项目类型获取（中心/项目/基地）下拉
    GetProjectsByType: (data) => {
        let url = '/api/services/Upp/collection/GetProjectsByType';
        return ajaxFn(url, data);
    },
    // 创建年度报告
    CreateCurrencyAnnualReport: (data) => {
        let url = '/api/services/Upp/collection/CreateCurrencyAnnualReport';
        return ajaxFn(url, data);
    },
    // 获取年度报告详情
    GetAnnualReport: (data) => {
        let url = '/api/services/Upp/collection/GetAnnualReportInfo';
        return ajaxFn(url, data);
    },
    // 获取年度报告列表  供给
    GetAllAnnualReportByDside: (data) => {
        let url = '/api/services/Upp/collection/GetAllAnnualReportByDside';
        return ajaxFn(url, data);
    },
    // 获取年度报告列表  经营
    GetAllAnnualReportByBside: (data) => {
        let url = '/api/services/Upp/collection/GetAllAnnualReportByBside';
        return ajaxFn(url, data);
    },
    // 删除
    DeleteAnnualReportById: (data) => {
        let url = '/api/services/Upp/collection/DeleteAnnualReportInfoById';
        return ajaxFn(url, data);
    },
    //教师下拉
    GetMemberSelect: (data) => {
        let url = '/api/services/Upp/collection/GetMemberSelect';
        return ajaxFn(url, data);
    },


    // 创建
    CreateProjectTeamMember: (data) => {
        let url = '/api/services/Upp/experimentalShare/CreateProjectTeamMember';
        return ajaxFn(url, data);
    },
    // 详情
    GetProjectTeamInfoById: (data) => {
        let url = '/api/services/Upp/experimentalShare/GetProjectTeamInfoById';
        return ajaxFn(url, data);
    },
    // 供给
    GetProjectTeamMemberByDside: (data) => {
        let url = '/api/services/Upp/experimentalShare/GetProjectTeamMemberByDside';
        return ajaxFn(url, data);
    },
    // 经营
    GetProjectTeamMemberByBside: (data) => {
        let url = '/api/services/Upp/experimentalShare/GetProjectTeamMemberByBside';
        return ajaxFn(url, data);
    },
    // 下拉
    GetBasicInformationSelectList: (data) => {
        let url = '/api/services/Upp/experimentalShare/GetBasicInformationSelectList';
        return ajaxFn(url, data);
    },
    // 删除
    DeletetProjectTeamMember: (data) => {
        let url = '/api/services/Upp/experimentalShare/DeletetProjectTeamMember';
        return ajaxFn(url, data);
    },







    // 供给
    GetShareOrderListByDside: (data) => {
        let url = '/api/services/Upp/experimentalShareOrder/GetShareOrderListByDside';
        return ajaxFn(url, data);
    },
    // 获取共享订单 经营
    GetShareOrderListByBside: (data) => {
        let url = '/api/services/Upp/experimentalShareOrder/GetShareOrderListByBside';
        return ajaxFn(url, data);
    },
    // 供给侧给共享订单打分
    GiveOrderGradeByDside: (data) => {
        let url = '/api/services/Upp/experimentalShareOrder/GiveOrderGradeByDside';
        return ajaxFn(url, data);
    },
    // 获取订单详情，根据ID
    GetShareOrderById: (data) => {
        let url = '/api/services/Upp/experimentalShareOrder/GetShareOrderById';
        return ajaxFn(url, data);
    },
}

export { projectOrderManagementService }