import React from 'react';
import { Link } from 'react-router-dom';
import UtilsTable from '../../../components/utils/UtilsTable';
import { message, Modal, Divider } from 'antd';
import { eventConfig } from '../../../config/gloableEventConfig';
import { GlobalEventer } from '../../../utils/EventDispatcher';
import DistributeManagement from './distribute'
import DistributedStu from './studentLists'
import { examRoomManagementService } from '../../../services/sharing/examRoomManagementService';

export default class basicInformationManagement extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            search: {},
            tableInfo: {
                loading: false,
                refresh: false,
                searchText: "",
                curPageNum: 1,
                curPageSize: 10,
                data: {},
            },
            loading: true,
            school: [],
            visible: false,
            visibleStu: false,
            id: ''
        }
    }
    async componentDidMount() {
        this.getPage();
    }

    getPage = (pageNum = 0, pageSize = this.state.tableInfo.curPageSize) => {
        this.setState(state => {
            state.tableInfo.loading = true;
            return state;
        });
        let data = {
            skipCount: pageNum * pageSize,
            maxResultCount: pageSize,
        }
        let searchData = Object.assign({}, data, this.state.search);
        examRoomManagementService.GetExaminationRoomList(searchData).then(r => {
            if (r.success) {
                let tableInfo = {
                    loading: false,
                    refresh: false,
                    searchText: '',
                    curPageNum: pageNum + 1,
                    curPageSize: pageSize,
                    data: r.result
                }
                this.setState({ tableInfo: tableInfo });
            }
        }).catch(error => {
            console.log(error)
            message.error('获取数据失败');
        });
    }
    getSearchFields = (data) => {
        this.setState({ search: data }, () => {
            this.getPage();
        })
    }
    goAdd = () => {
        GlobalEventer.eventer.dispatchAll(eventConfig.GhangeMenuSelectedKeys, '/basicInformationManagement/add');
        this.setState({
            loading: false
        }, () => {
            this.props.history.push("/basicInformationManagement/add")
        });
    }
    editInfo = (id) => {
        this.props.history.push("/basicInformationManagement/edit/" + id);
    }
    addInfo = (id) => {
        this.props.history.push("/basicInformationManagement/addOther/" + id);
    }
    deleteInfo = (id) => {
        let self = this;
        Modal.confirm({
            title: '确定删除此考场？',
            content: '删除此考场后将删除其相关联信息！！！',
            onOk() {
                console.log('OK');
                try {
                    examRoomManagementService.DeleteExaminationRoomById({ id }).then((res) => {
                        if (res.result && res.success) {
                            message.success('删除成功')
                            self.getPage();
                        } else {
                            message.error('删除失败');
                        }
                    })
                } catch (error) {
                    message.error('删除失败，请重试');
                    console.log('error=>' + error)
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    showModal = (id, examsId) => {
        this.setState({
            visible: true,
            id,
            examsId
        });
    };
    showModalStu = (id) => {
        this.setState({
            visibleStu: true,
            id,
        });
    }
    handleOk = () => {
        this.dis.distribute();
        this.setState({
            visible: false,
        });
    };
    handleOkStu = () => {
        // this.dis.distribute();
        this.setState({
            visibleStu: false,
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
            visibleStu: false,
        });
    };

    render() {
        let commomColumns = [
            {
                title: '考场编号',
                dataIndex: 'number',
                // render: (text, record, index) => {
                //     return <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                //         <Link to={'/basicInformationManagement/view/' + record.id}>{text}</Link>
                //     </div>
                // }
            },
            {
                title: '考试名称',
                dataIndex: 'examsName'
            },
            {
                title: '考场人数',
                dataIndex: 'personQuantity'
            },
            {
                title: '考试地点',
                dataIndex: 'address',
            },
            {
                title: '已分配人数',
                dataIndex: 'assignedQuantity',
            },
            {
                title: '创建时间',
                dataIndex: 'creationTimeStr'
            },

        ]
        const columns = [
            ...commomColumns,
            {
                title: '操作',
                key: 'action',
                width: '230px',
                render: (text, record) => {
                    return (
                        <span>
                            <a onClick={e => { this.showModal(record.id, record.examsId) }} >分配考生</a>
                            <Divider type="vertical" />
                            <a onClick={e => { this.showModalStu(record.id) }} >查看已分配考生</a>
                            <Divider type="vertical" />
                            <a onClick={e => this.editInfo(record.id)} >修改</a>
                            <Divider type="vertical" />
                            <a onClick={e => this.deleteInfo(record.id)} >删除</a>
                        </span>
                    )
                }
            }
        ];
        const searchFields = [
            {
                title: "所属学校",
                name: "schoolId",
                type: "select",
                placeholder: "请选择",
                options: this.state.school
            },
            {
                title: "项目名称",
                name: "name",
                type: "text",
                placeholder: "请输入",

            },
            {
                title: "所属课程",
                name: "courseName",
                type: "text",
                placeholder: "请输入",

            },
        ];
        const data = {
            top: {
                title: '考场管理',
                operation: [
                    { fun: this.goAdd, name: '考场添加' }
                ]
            },
            search: {
                searchFields,
                getSearchFields: this.getSearchFields
            },
            table: {
                columns,
                tableInfo: this.state.tableInfo,
                fetchData: this.getPage
            }
        }
        return (
            <div>
                <UtilsTable data={data}></UtilsTable>
                <Modal
                    title="分配考生"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    width={'800px'}
                >
                    <DistributeManagement ref={(e) => { this.dis = e }} id={this.state.id} examsId={this.state.examsId} />
                </Modal>
                <Modal
                    title="已分配考生"
                    visible={this.state.visibleStu}
                    onOk={this.handleOkStu}
                    onCancel={this.handleCancel}
                    width={'1000px'}
                >
                    <DistributedStu id={this.state.id} />
                </Modal>
            </div>
        )
    }
}