import React from 'react';
import { Button, message } from 'antd';
import { UtilsView } from '../../../components/utils/UtilsView';
import { projectOrderManagementService } from '../../../services/sharing/projectOrderManagementService';


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
            let dataResult = await projectOrderManagementService.GetShareOrderById(data);
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
        let gradeObject = {
            "0": '未评分',
            "1": '优秀',
            "2": '达标',
            "3": '未达标',
        }
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
                        label: '性别',
                        text: result.sexIsGirl?'女':'男' || ''
                    }
                ]
            },
            {
                cols: [
                    {
                        label: '实验结果',
                        upload: JSON.parse(result.attachment||'[]') || ''
                    }
                ]
            },
            {
                cols: [
                    {
                        label: '成绩',
                        text: gradeObject[result.grade] || ''
                    }
                ]
            },
            {
                cols: [
                    {
                        label: '生日',
                        text: result.birthdayStr || ''
                    }
                ]
            },
            {
                cols: [
                    {
                        label: '学历',
                        text: result.educationStr || ''
                    }
                ]
            }, {
                cols: [
                    {
                        label: '学位',
                        text: result.degreeStr || ''
                    }
                ]
            },
            {
                cols: [
                    {
                        label: '身份类型',
                        text: result.demandCredentialsTypeStr||''
                    }
                ]
            }, {
                cols: [
                    {
                        text: result.technicalPositionsStr,
                        label: '专业技术职务',
                    },
                ]
            },
            {
                cols: [
                    {
                        text: result.administrativeDuties,
                        label: '行政职务',
                    }
                ]
            }, {
                cols: [
                    {
                        text: result.phone,
                        label: '手机',
                    },
                ]
            }, {
                cols: [
                    {

                        text: result.email,
                        label: '电子邮箱',
                    },
                ]
            }, {
                cols: [
                    {

                        text: result.detailsAddress,
                        label: '详细地址',
                    },
                ]
            }, {
                cols: [
                    {

                        text: result.zipCode,
                        label: '邮编',
                    },
                ]
            },
            {
                cols: [
                    {
                        colStyle: formItemLayout,
                        itemStyle: formItemLayout,
                        richText: result.academicResults,
                        label: '学术相关成果',
                    },
                ]
            },
            {
                cols: [
                    {
                        colStyle: formItemLayout,
                        itemStyle: formItemLayout,
                        richText: result.academicResultsArticles,
                        label: '学术相关文章',
                    },
                ]
            },
            {
                cols: [
                    {
                        colStyle: formItemLayout,
                        itemStyle: formItemLayout,
                        richText: result.teachingArticles,
                        label: '教学相关文章',
                    },
                ]
            },
            {
                cols: [
                    {
                        colStyle: formItemLayout,
                        itemStyle: formItemLayout,
                        richText: result.researchSubject,
                        label: '教学科研课题',
                    },
                ]
            },
            {
                cols: [
                    {
                        colStyle: formItemLayout,
                        itemStyle: formItemLayout,
                        richText: result.personalProfile,
                        label: '个人简介',
                    },
                ]
            },
            {
                cols: [
                    {
                        colStyle: formItemLayout,
                        itemStyle: formItemLayout,
                        richText: result.academicTopic,
                        label: '近五年学术研究课题',
                    },
                ]
            },
            {
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