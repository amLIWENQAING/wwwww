import { ajaxFn } from '../../utils/uppAxios';

const examManagementService = {
    // 获取活动
    GetExamsActivity: (data) => {
        let url = '/api/services/Upp/examination/GetExamsActivity';
        return ajaxFn(url, data);
    },
    // 创建考试
    CreateBasicInformation: (data) => {
        let url = '/api/services/Upp/examination/CreateBasicInformation';
        return ajaxFn(url, data);
    },
    // 考试列表
    GetExamsList: (data) => {
        let url = '/api/services/Upp/examination/GetExamsList';
        return ajaxFn(url, data);
    },
        //考试详情
    GetExamsDetail: (data) => {
        let url = '/api/services/Upp/examination/GetExamsDetail';
        return ajaxFn(url, data);
    },
    //删除考试
    DeleteExamsById: (data) => {
        let url = '/api/services/Upp/examination/DeleteExamsById';
        return ajaxFn(url, data);
    },
}

export { examManagementService }