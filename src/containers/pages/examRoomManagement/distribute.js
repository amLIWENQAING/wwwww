import React from 'react';
import { Button, message, Spin, Form, Input } from 'antd';
import UtilsTable from '../../../components/utils/UtilsTable';
import { examRoomManagementService } from '../../../services/sharing/examRoomManagementService';
import { checkUnique } from '../../../utils/checkUnique';
import { setData } from '../../../../public/utf8-php/third-party/zeroclipboard/ZeroClipboard';
import { async } from 'q';

class DistributeManagement extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            op: '',
            step: 1,
            selData: [],
            selTableInfo: {
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
            // 活动详情
            totalData: [],
            selectedRowKeys: [],
            temporarySelectedRowKeys: [],
            spining: false
        }
    }
    async componentDidMount() {
        // this.getdata()
    }
    getdata = async(pageNum = 0, pageSize = 10) => {
        try {
            this.setState(state => {
                state.selTableInfo.loading = true;
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
            this.setState({ selTableInfo: tableInfo });
        } catch (error) {
            console.log(error);
            message.error('获取数据失败');
        }
    }
    // 批量数据整理
    getPage = (pageNum = 0, pageSize = this.state.selTableInfo.curPageSize) => {
        let selData = this.state.selData;
        console.log(555, setData);
        let tableInfo = {
            loading: false,
            refresh: false,
            searchText: '',
            curPageNum: pageNum + 1,
            curPageSize: pageSize,
            data: {
                "totalCount": selData.length,
                "items": selData
            }
        }
        this.setState({ selTableInfo: tableInfo })
    }

    getSearchFields = (data) => {
        if (data && data.creationTime) {
            let searchTime = setSearchTime(data.creationTime);
            data.startTime = searchTime.startTime;
            data.endTime = searchTime.endTime;
        }
        this.setState({
            search: data,
            temporarySelectedRowKeys: this.state.selectedRowKeys
        }, () => {
            this.getStudentList();
        })
    }

    //获取考生列表
    getStudentList = async (pageNum = 0, pageSize = this.state.allTableInfo.curPageSize) => {
        try {

            this.setState(state => {
                state.allTableInfo.loading = true;
                state.op = 'selStudent';
                state.step = 2;
                state.modalWidth = '60%';
                return state;
            });
            let data = {
                skipCount: pageNum * pageSize,
                maxResultCount: pageSize,
                examsId:this.props.examsId
            }
            let searchData = Object.assign({}, data, this.state.search);
            let allStudent = await examRoomManagementService.GetExamSignUpList(searchData);
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
            this.setState({ allTableInfo: tableInfo, totalData: this.state.totalData.concat(allStudent.items) });
        } catch (error) {
            console.log(error);
            message.error('获取数据失败');
        }
    }

    //列表选择框
    onSelectChange = (selectedRowKeys, selectedRows) => {
        console.log(77777, selectedRowKeys, selectedRows);
        let self = this;
        self.setState((state) => {
            state.temporarySelectedRowKeys = selectedRowKeys;
            return state;
        });
    }

    // 批量选择
    selMoreStudent = () => {
        let rowKeys = this.state.temporarySelectedRowKeys;
        if (!rowKeys || rowKeys.length == 0) {
            message.error("请选择考生");
            return;
        }
        // 去重
        let hash = {};
        console.log(4444, this.state.totalData);

        let allTableInfo = this.state.totalData.reduce(function (item, next) {
            hash[next.idNumber] ? '' : hash[next.idNumber] = true && item.push(next);
            return item
        }, [])
        let items = []
        //批量选择 不重复添加
        let tableDate = this.state.selData;
        for (let i = 0; i < rowKeys.length; i++) {
            for (let j = 0; j < allTableInfo.length; j++) {

                if (rowKeys[i] == allTableInfo[j].id) {

                    if (tableDate.length > 0) {
                        let isExit = false;
                        for (let k = 0; k < tableDate.length; k++) {

                            if (tableDate[k].id == allTableInfo[j].id) {
                                isExit = true;
                            }
                        }

                        if (!isExit) {
                            items.push(allTableInfo[j]);
                        }
                    }
                    else {
                        items.push(allTableInfo[j]);
                    }
                }
            }
        }
        this.selStudent(items, 'all')
    }
    // 选择企业
    selStudent = (items, type) => {
        let arr = this.state.selData;
        let keys = [];
        let isRepeat = false
        if (items.length != 0) {
            for (let i = 0; i < arr.length; i++) {
                if (type != 'all') {
                    if (arr[i].id == items.id) {
                        isRepeat = true;
                    }
                }
            }
        }
        if (type == 'all') {
            arr = arr.concat(items);
        } else if (!isRepeat) {
            arr.push(items)
        }
        arr.map((item) => {
            keys.push(item.id);
        })
        this.setState((state) => {
            state.selData = arr;
            state.op = 'selAudit';
            state.step = 1;
            state.areaId = '',
                state.selectedRowKeys = keys,
                state.temporarySelectedRowKeys = keys
            // DOTO 设置数量
            return state
        }, () => {
            this.getPage();
        })
    }

    //分配
    distribute = () => {
        let { selTableInfo } = this.state;
        let data = {
            activityOrderIdList: [],
            examinationRoomId:this.props.id
        }
        this.setState({
            spining: true
        }, () => {
            if (selTableInfo.data.items.length == 0) {
                message.error("请选择考生");
                this.setState({
                    spining: false
                })
                return;
            } else if (selTableInfo.data.items.length > 0) {
                let arr = selTableInfo.data.items;
                for (let i = 0; i < arr.length; i++) {
                    data.activityOrderIdList.push(arr[i].id)
                }
            }
            examRoomManagementService.CreateAdmissionTicket(data).then(r => {
                if (r.success) {
                    message.success("分配成功");
                    this.handelAuditCancel();
                    this.handelCancel();
                }
            }).catch(error => {
                console.log(error)
                message.error(error.error.message);
                this.setState({
                    spining: false
                })
            });
        })

    }

    delStudent = (id) => {
        let arr = this.state.selData;
        let items = [];
        for (let i = 0; i < arr.length; i++) {
            if (typeof (arr[i]) != "undefined") {
                if (arr[i].id != id) {
                    items.push(arr[i]);
                }
            }
        }
        let { selectedRowKeys } = this.state;
        let index = selectedRowKeys.indexOf(id);
        selectedRowKeys.splice(index, 1);

        this.setState((state) => {
            state.selData = items,
                state.selectedRowKeys = selectedRowKeys
            return state;
        }, () => {
            this.getPage()
        })
    }

    getRowSelection = () => {
        const self = this;
        const rowSelection = {
            selectedRowKeys: self.state.temporarySelectedRowKeys,
            onChange: self.onSelectChange,
            onSelect: self.onSelect,
            onSelectAll: self.onSelectAll,
        };
        return rowSelection;
    }

    initForm = (form) => {
        this.form = form;
    }

    resetField = () => {
        let { selectedRowKeys } = this.state;
        this.setState({
            temporarySelectedRowKeys: selectedRowKeys
        })
    }
    render() {
        let commomColumns = [
            {
                title: '姓名',
                dataIndex: 'studentName'
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
                title: '电话',
                dataIndex: 'phoneNumber'
            },
        ]
        const columns = [
            ...commomColumns,
            {
                title: '操作',
                key: 'action',
                render: (text, record) => {
                    return <span>
                        <a onClick={() => this.delStudent(record.id)} >删除</a>
                    </span>
                }
            }
        ];
        const data = {
            top: {
                title: '',
                operation: [
                    { fun: () => { this.getStudentList() }, name: '选择考生', style: { marginTop: 10, float: "left" } }
                ]
            },
            table: {
                columns,
                tableInfo: this.state.selTableInfo,
                fetchData: this.getPage
            }
        }
        const StudentColumns = [
            ...commomColumns,
            {
                title: '操作',
                key: 'action',
                render: (text, record) => {
                    return (<a onClick={() => this.selStudent(record, '1')}>选择</a>)
                }
            }
        ];
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
        const rowSelection = this.getRowSelection();
        const StudentData = {
            top: {
                title: '考生列表',
                operation: [
                    { fun: this.selMoreStudent, name: '批量选择' }
                ]
            },
            search: {
                searchFields: StudentsSearchFields,
                getSearchFields: this.getSearchFields,
                resetField: this.resetField
            },
            table: {
                columns: StudentColumns,
                tableInfo: this.state.allTableInfo,
                fetchData: this.getStudentList,
                rowSelection: rowSelection
            }
        }
        return (
            <div>
                <div>
                    {this.state.step == '1' &&
                        <div>
                            <UtilsTable data={data} />
                        </div>
                    }
                </div>
                {this.state.op == 'selStudent' &&
                    <UtilsTable data={StudentData} />
                }
            </div>
        )
    }
}
// const WrapDistributeManagement = Form.create()(DistributeManagement);
export default DistributeManagement