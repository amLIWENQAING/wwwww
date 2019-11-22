import React from 'react';
import { Button, message, Spin } from 'antd';
import { keys } from 'lodash';
import { UtilsForm } from '../../../components/utils/UtilsForm';
import { checkUnique } from '../../../utils/checkUnique';
import { examRoomManagementService } from '../../../services/sharing/examRoomManagementService';
import { eventConfig } from '../../../config/gloableEventConfig';
import { GlobalEventer } from '../../../utils/EventDispatcher';
import { fileChecker } from '../../../utils/fileChecker';
import { getTypeById } from '../../../utils/utilFun';


export default class AddbasicInformationManagement extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            editFormInfo: null,
            videoArr: [],
            exams: [],
        };
    }

    async componentDidMount() {
        try {
            let exams = await examRoomManagementService.GetExamsSelect( )
            if (exams.success && exams.result) {
                exams = exams.result;
                this.setState({
                    exams
                })
            }
            let editFormInfo = null;
            if (keys(this.props.match.params).length > 0) {
                let data = { id: parseInt(this.props.match.params.id) };
                editFormInfo = await examRoomManagementService.GetExaminationRoomDetail(data)

                if (editFormInfo.success && editFormInfo.result) {
                    editFormInfo = editFormInfo.result;
                }
                this.setState((state) => {
                        state.editFormInfo = editFormInfo;
                    return state
                })

            }
        } catch (error) {
            message.error('获取数据失败');
        }
    }
    getItems = (state) => {
        let {
            exams,
        } = this.state;
        let self = this;
        let items = [
            {
                cols: [
                    {
                        id: 'number',
                        type: 'input',
                        label: '考场编号',
                        placeholder: '请填写考场编号',
                        showSearch: true,
                        option: {
                            initialValue: state.editFormInfo ? state.editFormInfo.number + '' : '',
                            rules: [
                                { required: true, max:100,message: '请填写考场编号' },
                            ]
                        },
                    },
                ]
            },
            {
                cols: [
                    {
                        id: 'personQuantity',
                        type: 'input',
                        label: '考场人数',
                        placeholder: '请输入考场人数',
                        option: {
                            initialValue: state.editFormInfo ? state.editFormInfo.personQuantity+'' : '',
                            rules: [
                                { required: true, max: 100, message: '请输入考场人数', whitespace: true },
                            ]
                        },
                    },
                ]
            },
            {
                cols: [
                    {
                        id: 'address',
                        type: 'input',
                        label: '考场地点',
                        placeholder: '请选择考场地点',
                        option: {
                            initialValue: state.editFormInfo ? state.editFormInfo.address + '' : '',
                            rules: [
                                { required: true, message: '请选择考场地点' },
                            ]
                        },
                    },
                ]
            },
            {
                cols: [
                    {
                        id: 'examsId',
                        type: 'select',
                        label: '对应考试',
                        option: {
                            initialValue: state.editFormInfo ? state.editFormInfo.examsId+'': '',
                            rules: [
                                { required: true, message: '请选择对应考试' },
                            ],
                        },
                        options: exams,
                    },
                ]
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
    // 提交
    handleSave = () => {
        let { editFormInfo } = this.state;
        this.setState({
            loading: true
        }, () => {
            this.form.validateFieldsAndScroll((err, data) => {
                if (!err) {
                    let createData = {
                        examsId: data.examsId,
                        number: data.number,
                        personQuantity: data.personQuantity,
                        address: data.address,
                        id: 0,
                    }
                    if (editFormInfo && editFormInfo.demandStatus !== 3) {
                        createData.id = editFormInfo.id;
                    }
                    this.submit(createData);
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
            examRoomManagementService.CreateExaminationRoom(createData)
                .then(r => {
                    if (r.result.isSuccess == true) {
                        message.success(r.result.message);
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
        GlobalEventer.eventer.dispatchAll(eventConfig.GhangeMenuSelectedKeys, '/basicInformationManagement');
        this.setState({
            loading: false
        }, () => {
            this.props.history.push("/basicInformationManagement")
        });
    }
    initForm = (form) => {
        this.form = form;
    }

    render() {
        const items = this.getItems(this.state);
        const loading = false;
        return (
            <Spin spinning={loading}>
                <UtilsForm items={items} initForm={this.initForm} />
            </Spin>
        );
    }
}