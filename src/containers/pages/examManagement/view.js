import React from 'react';
import { Button, message } from 'antd';
import { UtilsView } from '../../../components/utils/UtilsView';
import { examManagementService } from '../../../services/sharing/examManagementService';


export default class ProjectTeamManagementView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataResult: {},
        }
    }

    async componentDidMount() {
        try {
            let data = { id: parseInt(this.props.match.params.id) };
            let dataResult = await examManagementService.GetProjectTeamInfoById(data);
            if (dataResult.success && dataResult.result) {
                dataResult = dataResult.result;
            }
            this.setState({
                dataResult,
            });
        } catch (error) {
            console.log('error=>',error);
            message.error('获取数据失败');
        }
    }
    handelCancel = () => {
        this.props.history.go(-1)
    }
    setItem = (result) => {
        let self = this;
        let formItemLayout = {
            labelCol: {
                xs: { span: 2 },
                sm: { span: 2 },
            },
            wrapperCol: {
                xs: { span: 18 },
                sm: { span: 18 },
            },
        };
        let data = [
            {
                cols: [
                    {
                        label: '姓名',
                        text: result.name || ''
                    }
                ]
            },
            {
                cols: [
                    {
                        label: '人员类型',
                        text: result.memberTypeStr || ''
                    }
                ]
            },
            {
                cols: [
                    {
                        label: '性别',
                        text: result.sexIsGirl?'女':'男'
                    }
                ]
            }, {
                cols: [
                    {
                        label: '所在单位',
                        text: result.unitTypeStr || ''
                    }
                ]
            },{
                cols: [
                    {
                        label: '单位名称',
                        text: result.unitName
                    }
                ]
            },{
                cols: [
                    {
                        label: '专业技术职务',
                        text: result.technicalPositionsStr
                    }
                ]
            },{
                cols: [
                    {
                        label: '行政职务',
                        text: result.administrativeDuties
                    }
                ]
            },{
                cols: [
                    {
                        label: '承担任务',
                        text: result.undertakeTask
                    }
                ]
            },{
                cols: [
                    {
                        label: '备注',
                        richText: result.remarks
                    }
                ]
            },{
                colStyle: { offset: 1, span: 23 },
                render: () => {
                    return (
                        <Button onClick={this.handelCancel}>返回</Button>
                    )
                }
            }
        ];
        return data;

    }

    render() {
        const items = this.setItem(this.state.dataResult);

        return (
            <div>
                <UtilsView items={items} />
            </div>
        )
    }
}