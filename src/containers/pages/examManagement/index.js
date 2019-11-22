import React from 'react';
import { Link } from 'react-router-dom';
import UtilsTable from '../../../components/utils/UtilsTable';
import { message, Modal, Divider } from 'antd';
import { eventConfig } from '../../../config/gloableEventConfig';
import { GlobalEventer } from '../../../utils/EventDispatcher';
import { examManagementService } from '../../../services/sharing/examManagementService';

export default class DSUBProjectTeamManagement extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            search: {},
            tableInfo: {
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
            loading: false,
            shareId:[]
        }
    }

    async componentWillMount() {
        try {
            // 基本信息下拉
            let shareId = await examManagementService.GetBasicInformationSelectList()
            if (shareId.success && shareId.result) {
                shareId = shareId.result;
                this.setState({
                    shareId
                })
            }
        } catch (error) {
            
        }
        this.getPage();
    }

    getPage = (pageNum = 0, pageSize = this.state.tableInfo.curPageSize) => {
        this.setState(state => {
            state.tableInfo.loading = true;
            return state;
        });
        let data = {
            "skipCount": pageNum * pageSize,
            "maxResultCount": pageSize,
        }
        let searchData = Object.assign({}, data, this.state.search);
        examManagementService.GetExamsList(searchData).then(r => {
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
        GlobalEventer.eventer.dispatchAll(eventConfig.GhangeMenuSelectedKeys, '/projectTeamManagement/add');
        this.setState({
            spinning: false
        }, () => {
            this.props.history.push("/projectTeamManagement/add")
        });
    }
    editCenter = (id) => {
        this.props.history.push("/projectTeamManagement/edit/"+id);
    }
    deleteCenter = (id) => {
        let self = this;
        Modal.confirm({
            title: '确定删除此人员？',
            content: '删除此人员后将删除其相关联信息！！！',
            onOk() {
                console.log('OK');
                try {
                    examManagementService.DeletetProjectTeamMember({ id }).then((res) => {
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
    render() {
        let commomColumns = [
            {
                title: '考试名称',
                width: '200px',
                dataIndex: 'name',
                render: (text, record, index) => {
                    return <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <Link to={'/projectTeamManagement/view/' + record.id}>{text}</Link>
                    </div>
                }
            },
            {
                title: '考试时间',
                dataIndex: 'creationTimeStr',
                render: (text, record, index) => {
                    return <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {record.testTimeStartStr+'~'+record.testTimeEndStr}
                    </div>
                }
            },
            {
                title:'创建时间',
                dataIndex: 'creationTimeStr',
            },
        ]
        const columns = [
            ...commomColumns,
            {
                title: '操作',
                key: 'action',
                width: '120px',
                render: (text, record) => {
                    return (
                        <span>
                            <a onClick={e => this.editCenter(record.id)} >修改</a>
                            <Divider type="vertical" />
                            <a onClick={e => this.deleteCenter(record.id)} >删除</a>
                        </span>
                    )
                }
            }
        ];
        const searchFields = [
            {
                title: "姓名",
                name: "name",
                type: "text",
                placeholder: "请输入",
            },
            {
                title: "所属基本信息",
                name: "shareId",
                type: "select",
                placeholder: "请选择",
                options:this.state.shareId
            },
        ];
        const data = {
            top: {
                title: '考试管理',
                operation: [
                    { fun: this.goAdd, name: '考试添加' }
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
            </div>
        )
    }
}