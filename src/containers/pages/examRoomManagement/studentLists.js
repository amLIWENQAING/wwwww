import React from 'react';
import { Button, message, Spin, Form, Input } from 'antd';
import UtilsTable from '../../../components/utils/UtilsTable';
import { examRoomManagementService } from '../../../services/sharing/examRoomManagementService';
import { checkUnique } from '../../../utils/checkUnique';

class DistributedStu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            allTableInfo: {
                "loading": false,
                "refresh": false,
                "searchText": "",
                "curPageNum": 1,
                "curPageSize": 10,
                "data": {
                    "totalCount": 0,
                    "items": []
                }
            },
            spining: false
        }
    }
    componentDidMount() {
        this.getStudentList()
    }
    getSearchFields = (data) => {
        this.setState({
            search: data,
        }, () => {
            this.getStudentList();
        })
    }

    //获取考生列表
    getStudentList = async (pageNum = 0, pageSize = this.state.allTableInfo.curPageSize) => {
        try {

            this.setState(state => {
                state.allTableInfo.loading = true;
                return state;
            });
            let data = {
                skipCount: pageNum * pageSize,
                maxResultCount: pageSize,
                examinationRoomId:this.props.id
            }
            let searchData = Object.assign({}, data, this.state.search);
            let allStudent = await examRoomManagementService.GetTicketListByRoomId(searchData);
            if (allStudent.success && allStudent.result) {
                allStudent = allStudent.result;
            }
            let tableInfo = {
                loading: false,
                refresh: false,
                searchText: '',
                curPageNum: pageNum + 1,
                curPageSize: pageSize,
                // data: {},
                data: allStudent
            }
            this.setState({ allTableInfo: tableInfo });
        } catch (error) {
            console.log(error);
            message.error('获取数据失败');
        }
    }

    initForm = (form) => {
        this.form = form;
    }
    render() {
        let StudentColumns = [
            {
                title: '姓名',
                dataIndex: 'studentName'
            },
            {
                title: '准考证号',
                dataIndex: 'admissionNumber'
            },
            {
                title: '学号',
                dataIndex: 'studentNumber'
            },
            {
                title: '性别',
                dataIndex: 'sex'
            },
            {
                title: '身份证',
                dataIndex: 'idNumber'
            },
            {
                title: '学校',
                dataIndex: 'departmentName'
            },
            {
                title: '专业',
                dataIndex: 'professionalName'
            },
        ]
        const StudentsSearchFields = [
            {
                title: "姓名",
                name: "name",
                type: "text",
                placeholder: "请输入"
            },
            {
                title: "学校",
                name: "name",
                type: "text",
                placeholder: "请输入"
            },
            {
                title: "学院",
                name: "name",
                type: "text",
                placeholder: "请输入"
            },
            {
                title: "专业",
                name: "name",
                type: "text",
                placeholder: "请输入"
            },
            {
                title: "入学日期",
                name: "name",
                type: "text",
                placeholder: "请输入"
            },
        ];
        const StudentData = {
            top: {
                title: '考生列表',
            },
            search: {
                searchFields: StudentsSearchFields,
                getSearchFields: this.getSearchFields,
                // resetField: this.resetField
            },
            table: {
                columns: StudentColumns,
                tableInfo: this.state.allTableInfo,
                fetchData: this.getStudentList,
            }
        }
        return (
            <div>
                <UtilsTable data={StudentData} />
            </div>
        )
    }
}
// const WrapDistributedStu = Form.create()(DistributedStu);
export default DistributedStu