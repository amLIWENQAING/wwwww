import React from 'react';
import { Button, message, Spin, Modal } from 'antd';
import { keys } from 'lodash';
import { UtilsForm } from '../../../components/utils/UtilsForm';
import UtilsTable from '../../../components/utils/UtilsTable';
import { examManagementService } from '../../../services/sharing/examManagementService';
import { eventConfig } from '../../../config/gloableEventConfig';
import { setSearchTime } from '../../../utils/utilFun';

import moment from 'moment';
import { fileChecker } from '../../../utils/fileChecker';
import { GlobalEventer } from '../../../utils/EventDispatcher';

export default class AddprojectTeamManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            activity: [],
            selData: [],
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
            totalData: [],
            selectedRows: [],
            temporarySelectedRowKeys:''
        };
    } d

    async componentDidMount() {
        this.getStudentList();
        try {
            let editFormInfo = null;
            if (keys(this.props.match.params).length > 0) {

                let data = { id: parseInt(this.props.match.params.id) };
                editFormInfo = await examManagementService.GetExamsDetail(data)

                if (editFormInfo.success && editFormInfo.result) {
                    editFormInfo = editFormInfo.result;
                    this.setState((state) => {
                        state.editFormInfo = editFormInfo;
                        state.temporarySelectedRowKeys = [editFormInfo.activityId];
                        return state
                    })
                }
            }

        } catch (error) {
            message.error('获取数据失败');
            console.log('error=>', error);
        }
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
    //获取求职者列表
    getStudentList = async (pageNum = 0, pageSize = this.state.allTableInfo.curPageSize) => {
        try {

            this.setState(state => {
                state.allTableInfo.loading = true;
                return state;
            });
            let data = {
                "skipCount": pageNum * pageSize,
                "maxResultCount": pageSize,
            }
            let searchData = Object.assign({}, data, this.state.search);
            let activity = await examManagementService.GetExamsActivity(searchData)
            if (activity.success && activity.result) {
                activity = activity.result;
            }
            let tableInfo = {
                loading: false,
                refresh: false,
                searchText: '',
                curPageNum: pageNum + 1,
                curPageSize: pageSize,
                // data: {},
                data: activity
            }
            this.setState({ allTableInfo: tableInfo, totalData: this.state.totalData.concat(activity.items) });
        } catch (error) {
            console.log(error);
            message.error('获取数据失败');
        }
    }

    //列表选择框
    onSelectChange = (selectedRowKeys, selectedRows) => {
        console.log(555, selectedRowKeys, selectedRows);
        let self = this;
        self.setState((state) => {
            state.temporarySelectedRowKeys = selectedRowKeys;
            state.selectedRows = selectedRows;
            return state;
        });
    }

    // 选择企业
    selStudent = (items, type) => {
        console.log('items', items);
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
        })
    }



    getRowSelection = () => {
        const self = this;
        const rowSelection = {
            selectedRowKeys: self.state.temporarySelectedRowKeys,
            onChange: self.onSelectChange,
            onSelect: self.onSelect,
            onSelectAll: self.onSelectAll,
            type: 'radio'
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

    getItems = (state) => {
        let items = [
            {
                cols: [
                    {
                        id: 'name',
                        type: 'input',
                        label: '考试名称',
                        option: {
                            initialValue: state.editFormInfo ? state.editFormInfo.name : '',
                            rules: [
                                { required: true, max: 100, message: '请输入考试名称', whitespace: true },
                            ]
                        },
                        itemProps: {
                            maxLength: 100
                        }
                    },
                ]
            },
            {
                cols: [
                    {
                        
                        id: 'time',
                        type: 'rangePicker',
                        label: '考试时间',
                        placeholder: ['考试开始时间', '考试结束时间'],
                        option: {
                            initialValue: state.editFormInfo && state.editFormInfo.testTimeEnd && state.editFormInfo.testTimeStart
                                ?
                                [moment(state.editFormInfo.testTimeStart, 'YYYY-MM-DD HH:mm:ss'), moment(state.editFormInfo.testTimeEnd, 'YYYY-MM-DD HH:mm:ss')]
                                : null,
                            rules: [
                                { required: true, message: '请选择考试开始/结束时间' },
                            ]
                        },
                        itemProps: {
                            disabledDate:this.disabledDate
                        }
                    },
                ]
            },
            {
                colStyle: { offset: 2, span: 22 },
                render: () => {
                    return <div>
                        <label className='ant-form-item-required' style={{ marginLeft: '-25px', marginRight: '5px', color: 'rgba(0,0,0,0.85)' }}>所关联活动 : </label>
                        <span style={{marginRight:'20px'}}>{(this.state.selectedRows[0]&&this.state.selectedRows[0].ationctivityName)||(state.editFormInfo&&state.editFormInfo.ationctivityName)}</span>
                        <Button onClick={this.showModal}>关联活动</Button>
                    </div>
                }
            },
            {
                colStyle: { offset: 2, span: 22 },
                render: () => {
                    return (
                        <div style={{ marginTop: '20px' }}>

                            <Button style={{ marginRight: '20px' }} type='primary' disabled={this.state.loading} onClick={this.handleSave}>提交</Button>

                            <Button onClick={this.handleCancel}>返回</Button>
                        </div>
                    );
                }
            }
        ];
        return items;
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = () => {
        this.setState({
            visible: false,
        });
    };

    handleCancelModal = () => {
        this.setState({
            visible: false,
        });
    };


    // 提交
    handleSave = () => {
        let { editFormInfo } = this.state;
        this.setState({
            loading: true
        }, () => {

            this.form.validateFieldsAndScroll((err, data) => {
                if (!err) {
                    if (data && data.time) {
                        let time = setSearchTime(data.time, true);
                        data.testTimeStart = time.startTime;
                        data.testTimeEnd = time.endTime;
                    }
                    let createData = {
                        name: data.name,
                        testTimeStart: data.testTimeStart,
                        testTimeEnd: data.testTimeEnd,
                        activityId: this.state.temporarySelectedRowKeys[0],
                        id: 0,
                    }
                    if (editFormInfo && editFormInfo.demandStatus !== 3) {
                        createData.id = editFormInfo.id;
                    }
                    this.submit(createData)
                } else {
                    this.setState({
                        loading: false
                    });
                }
            });
        })


    }
    // 最终提交
    submit = (createData) => {
        this.setState({
            loading: true
        }, () => {
            examManagementService.CreateBasicInformation(createData)
                .then(r => {
                    if (r.result.isSuccess) {
                        message.success(r.result.message || '新增成功');
                        this.handleCancel();
                    } else {
                        message.error('操作失败' + r.result.message || '');
                        this.setState({
                            loading: false
                        });
                    }

                })
                .catch(error => {
                    message.error('操作失败' + error.error.message || '');
                    this.setState({
                        loading: false
                    });
                });
        });
    }
    handleCancel = () => {
        GlobalEventer.eventer.dispatchAll(eventConfig.GhangeMenuSelectedKeys, '/projectTeamManagement');
        this.setState({
            loading: false
        }, () => {
            this.props.history.push("/projectTeamManagement")
        });
    }
    initForm = (form) => {
        this.form = form;
    }

    render() {
        const items = this.getItems(this.state);
        const loading = false;
        let commomColumns = [
            {
                title: '活动名称',
                dataIndex: 'ationctivityName'
            },
            {
                title: '活动编号',
                dataIndex: 'activityNumber'
            },
            {
                title: '邮箱',
                dataIndex: 'email'
            },
            {
                title: '供给侧',
                dataIndex: 'deliveryEnterpriseName'
            },
            {
                title: '电话',
                dataIndex: 'contactNumber'
            },
        ]
        const StudentColumns = [
            ...commomColumns,
            // {
            //     title: '操作',
            //     key: 'action',
            //     render: (text, record) => {
            //         return (<a onClick={() => this.selStudent(record, '1')}>选择</a>)
            //     }
            // }
        ];
        const StudentsSearchFields = [
            {
                title: "活动名称",
                name: "ationctivityName",
                type: "text",
                placeholder: "请输入"
            },
            {
                title: "活动编号",
                name: "activityNumber",
                type: "text",
                placeholder: "请输入"
            },
            {
                title: "供给侧",
                name: "deliveryEnterpriseName",
                type: "text",
                placeholder: "请输入"
            },
        ];
        const rowSelection = this.getRowSelection();
        const StudentData = {
            top: {
                title: '活动列表',
                // operation: [
                //     { fun: this.selMoreStudent, name: '批量选择' }
                // ]
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
            <Spin spinning={loading}>
                <UtilsForm items={items} initForm={this.initForm} />
                <Modal
                    title="关联活动"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancelModal}
                    width='1000px'
                >
                    <UtilsTable data={StudentData} />
                </Modal>
            </Spin>
        );
    }
}