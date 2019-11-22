import React from 'react';
import { Link } from 'react-router-dom';
import UtilsTable from '../../../components/utils/UtilsTable';
import { message, Modal, Popover, Button, Radio } from 'antd';
import { eventConfig } from '../../../config/gloableEventConfig';
import { GlobalEventer } from '../../../utils/EventDispatcher';
import { projectOrderManagementService } from '../../../services/sharing/projectOrderManagementService';

export default class DSUBProjectOrderManagement extends React.Component {

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
            shareId: [],
            visible: false,
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
            "skipCount": pageNum * pageSize,
            "maxResultCount": pageSize,
        }
        let searchData = Object.assign({}, data, this.state.search);
        projectOrderManagementService.GetShareOrderListByDside(searchData).then(r => {
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
    hide = () => {
        this.setState({
            visible: false,
        });
    };

    handleVisibleChange = visible => {
        this.setState({ visible });
    };
    onChange = e => {
        let self = this;
        console.log('radio checked', e.target.value);
        let data = {
            shareOrderId: this.state.shareId,
            grade:e.target.value
        }
        try {
            projectOrderManagementService.GiveOrderGradeByDside(data).then((res) => {
                if (res.result && res.success) {
                    message.success('评分成功')
                    this.hide()
                    self.getPage();
                } else {
                    message.error('评分失败');
                }
            })
        } catch (error) {
            message.error('评分失败，请重试');
            console.log('error=>' + error)
        }
    };
    
    

    render() {
        let gradeObject = {
            "0": '未评分',
            "1": '优秀',
            "2": '达标',
            "3": '未达标',
        }
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
          };
       
        let commomColumns = [
            {
                title: '项目名称',
                dataIndex: 'basicName',
            },
            {
                title: '姓名',
                dataIndex: 'name',
                render: (text, record, index) => {
                    return <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <Link to={'/projectOrderManagement/view/' + record.id}>{text}</Link>
                    </div>
                }
            },
            {
                title: '身份类型',
                dataIndex: 'demandCredentialsTypeStr',
            },
            {
                title: '性别',
                dataIndex: 'sexIsGirl',
                render: (text) => {
                    return <span>
                        {text ? '女' : '男'}
                    </span>
                }
            },
            {
                title: '学校或行业',
                dataIndex: 'schoolOrIndustry',
            },
            {
                title: '学历',
                dataIndex: 'educationStr',
            },
            {
                title: '学位',
                dataIndex: 'degreeStr',
            },
            {
                title: '邮箱',
                dataIndex: 'email',
            },
            {
                title: '成绩',
                dataIndex: 'grade',
                render: (text) => {
                    return <span>
                        {gradeObject[text]}
                    </span>
                }
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
                            {!record.grade&&<Popover
                                content={
                                    <Radio.Group onChange={this.onChange} value={this.state.value}>
                                        <Radio style={radioStyle} value={1}>
                                            优秀
                                        </Radio>
                                        <Radio style={radioStyle} value={2}>
                                            达标
                                        </Radio>
                                        <Radio style={radioStyle} value={3}>
                                            不达标
                                        </Radio>
                                    </Radio.Group>
                                }
                                title="评分"
                                trigger="click"
                                visible={this.state.visible}
                                onVisibleChange={this.handleVisibleChange}
                            >
                                <Button type="primary" disabled={record.grade} onClick={()=>this.setState({shareId:record.id})}>评分</Button>
                            </Popover>}
                        </span>
                    )
                }
            }
        ];
        const searchFields = [
            {
                title: "名称",
                name: "basicName",
                type: "text",
                placeholder: "请输入",
            },
        ];
        const data = {
            top: {
                title: '实验管理',
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