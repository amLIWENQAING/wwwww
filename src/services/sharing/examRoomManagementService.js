import { ajaxFn } from '../../utils/uppAxios';

const examRoomManagementService = {
    GetExamsActivity: (data) => {
        let url = '/api/services/Upp/examination/GetExamsActivity';
        return ajaxFn(url, data);
    },
    // 获取考场
    GetExaminationRoomList: (data) => {
        let url = '/api/services/Upp/examination/GetExaminationRoomList';
        return ajaxFn(url, data);
    },
    // 获取考试下拉
    GetExamsSelect: (data) => {
        let url = '/api/services/Upp/examination/GetExamsSelect';
        return ajaxFn(url, data);
    },
    // 创建考场
    CreateExaminationRoom: (data) => {
        let url = '/api/services/Upp/examination/CreateExaminationRoom';
        return ajaxFn(url, data);
    },
    // 考生
    GetExamSignUpList: (data) => {
        let url = '/api/services/Upp/examination/GetExamSignUpList';
        return ajaxFn(url, data);
    },
    // 分配
    CreateAdmissionTicket: (data) => {
        let url = '/api/services/Upp/examination/CreateAdmissionTicket';
        return ajaxFn(url, data);
    },
    // 已分配
    GetTicketListByRoomId: (data) => {
        let url = '/api/services/Upp/examination/GetTicketListByRoomId';
        return ajaxFn(url, data);
    },
    //考试详情
    GetExaminationRoomDetail: (data) => {
        let url = '/api/services/Upp/examination/GetExaminationRoomDetail';
        return ajaxFn(url, data);
    },
    //删除考场
    DeleteExaminationRoomById: (data) => {
        let url = '/api/services/Upp/examination/DeleteExaminationRoomById';
        return ajaxFn(url, data);
    },
}
export { examRoomManagementService }