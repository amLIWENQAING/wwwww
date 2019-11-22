import React from 'react';
import { Button, message } from 'antd';
import { UtilsView } from '../../../components/utils/UtilsView';
import { examRoomManagementService } from '../../../services/sharing/examRoomManagementService';

export default class ExamRoomView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataObject: {},
        }
    }

    async componentDidMount() {
        try {
            let data = { id: parseInt(this.props.match.params.id) };
            let dataObject = await examRoomManagementService.GetExaminationRoomDetail(data);
            if (dataObject.success && dataObject.result) {
                dataObject = dataObject.result;
            }
            this.setState({
                dataObject,
            }, () => {
            });
        } catch (error) {
            console.log(error);
            message.error('获取数据失败');
        }
    }
    handelCancel = () => {
        this.props.history.go(-1);
    }
    setItem = (result) => {
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
        let dataObject = [
            {
                cols: [
                    {
                        label: '所属学校',
                        text: result.schoolName || ''
                    }
                ]
            },
            {
                cols: [
                    {
                        label: '实验教学项目名称',
                        text: result.name || ''
                    }
                ]
            },
            {
                cols: [
                    {
                        label: '所属课程名称',
                        text: result.courseName || ''
                    }
                ]
            },
            {
                cols: [
                    {
                        label: '对应专业',
                        text: result.correspondingMajorName || ''
                    }
                ]
            }, {
                cols: [
                    {
                        label: '负责人姓名',
                        text: result.personName || ''
                    }
                ]
            },
            {
                cols: [
                    {
                        label: '有效链接网址',
                        text: result.url||''
                    }
                ]
            },{
                cols: [
                    {
                        label: '试用账号',
                        text: result.trialAccount||''
                    }
                ]
            },{
                cols: [
                    {
                        label: '试用密码',
                        text: result.trialPassword||''
                    }
                ]
            }, {
                cols: [
                    {
                        label: '共享项目封皮',
                        src: result.cover||'',
                    }
                ]
            },{
                cols: [
                    {
                        label: '共享项目视频',
                        upload: JSON.parse(result.videos||'[]')
                    }
                ]
            },{
                cols: [
                    {
                        colStyle: formItemLayout,
                        itemStyle: formItemLayout,
                        label: '共享项目简介',
                        richText: result.introduction || ''
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
        return dataObject;

    }

    render() {
        const items = this.setItem(this.state.dataObject);

        return (
            <div>
                <UtilsView items={items} />
            </div>
        )
    }
}