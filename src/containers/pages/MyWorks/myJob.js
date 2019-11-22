import React from 'react';
import { Redirect } from '../examRoomManagement/D_Sub/react-router-dom';
import WelcomImg from '../../../content/img/wel.png';
import { commonService } from '../../../services/commonService';
import { eventConfig } from '../../../config/gloableEventConfig';
import { GlobalEventer } from '../../../utils/EventDispatcher';
import ManagementBusiness from './managementBusiness';
import ManagementStaff from './managementStaff';

export default class myJob extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            isShowWordToDo: false,
            managementBusinessData: {},
            managementStaffData: {
                BusinessMantDemandWork:0,
                BusinessMantPositionWork:{},
                BusinessManActivityWork:0
            }
        }
    }

    async componentWillMount() {
        // 判断账户类型。显示相应界面
        let partyIdentityCardType = this.props.history.CurrentUserParties.parties[0].partyIdentityCardType
        let isShowWordToDo = partyIdentityCardType == 21 || partyIdentityCardType == 23 ? true : false;
        if (partyIdentityCardType==21) {
            commonService.GetBusinessWorks().then(r => {
                this.setState({ managementBusinessData: r.result });
            }).catch(error => {
                message.error('获得消费侧未审核数据失败');
            });
        } else if (partyIdentityCardType == 23) {
            let managementStaffData = {}
            let BusinessMantDemandWork = await commonService.BusinessMantDemandWork();
            let BusinessManActivityWork = await commonService.BusinessManActivityWork();
            let BusinessMantPositionWork = await commonService.BusinessMantPositionWork();
            if (BusinessMantDemandWork.success && BusinessMantDemandWork.success && BusinessMantDemandWork.success) {
                managementStaffData.BusinessMantDemandWork = BusinessMantDemandWork.result;
                managementStaffData.BusinessManActivityWork = BusinessManActivityWork.result;
                managementStaffData.BusinessMantPositionWork = BusinessMantPositionWork.result;
                this.setState({
                    managementStaffData
                })
            } else (
                message.warning('获取工作台信息失败')
            )
        }
        this.setState({
            isShowWordToDo,
            partyIdentityCardType,
            name: this.props.history.CurrentUserParties.uppAccount.name,
            userName: this.props.history.CurrentUserParties.uppAccount.userName
        })
    }
    // 点击后跳转相应审核页面。
    getCheck = (type,type1) => {
        let { partyIdentityCardType } = this.state;
        if (partyIdentityCardType==21) {
            sessionStorage.setItem('checkType', type);
            GlobalEventer.eventer.dispatchAll(eventConfig.GhangeMenuSelectedKeys, '/consumptionManage');
            this.props.history.push("/consumptionManage");
        } else if (partyIdentityCardType == 23) {
            if (type == 'BusinessMantDemandWork') {
                sessionStorage.setItem('checkType', 'BusinessMantDemandWork');
                if (type1 == 'capitalCount') {
                    GlobalEventer.eventer.dispatchAll(eventConfig.GhangeMenuSelectedKeys, '/BSub/demandManage/capital');
                    this.props.history.push("/BSub/demandManage/capital");
                } else if (type1 == 'parkCount') {
                    GlobalEventer.eventer.dispatchAll(eventConfig.GhangeMenuSelectedKeys, '/BSub/demandManage/area');
                    this.props.history.push("/BSub/demandManage/area");
                } else if (type1 == 'personnelCount') {
                    GlobalEventer.eventer.dispatchAll(eventConfig.GhangeMenuSelectedKeys, '/BSub/demandManage/talent');
                    this.props.history.push("/BSub/demandManage/talent");
                } else if (type1 == 'serbiceCount') {
                    GlobalEventer.eventer.dispatchAll(eventConfig.GhangeMenuSelectedKeys, '/BSub/demandManage/serve');
                    this.props.history.push("/BSub/demandManage/serve");
                } else if (type1 == 'technologyCount') {
                    GlobalEventer.eventer.dispatchAll(eventConfig.GhangeMenuSelectedKeys, '/BSub/demandManage/technology');
                    this.props.history.push("/BSub/demandManage/technology");
                }
            } else if (type=='BusinessManActivityWork') {
                sessionStorage.setItem('checkType', type);
                GlobalEventer.eventer.dispatchAll(eventConfig.GhangeMenuSelectedKeys, '/BSub/activityManagement');
                this.props.history.push("/BSub/activityManagement");
            } else if (type=='BusinessMantPositionWork') {
                sessionStorage.setItem('checkType', type);
                GlobalEventer.eventer.dispatchAll(eventConfig.GhangeMenuSelectedKeys, '/BSub/positionManagement');
                this.props.history.push("/BSub/positionManagement");
            }
        }

    }

    render() {
        let { name, userName, managementBusinessData,managementStaffData, isShowWordToDo, partyIdentityCardType } = this.state;
        return (
            <div>
                {
                    isShowWordToDo
                        ?
                        <div>
                            <p style={{ fontSize: '20px', marginBottom: '100px' }}>您好，{userName}，欢迎登录 {name}！</p>
                            {partyIdentityCardType == 21 && <ManagementBusiness getCheck={this.getCheck} managementBusinessData={managementBusinessData} ></ManagementBusiness>}
                            {partyIdentityCardType == 23 && <ManagementStaff getCheck={this.getCheck} managementStaffData={managementStaffData} isShowWordToDo={isShowWordToDo}></ManagementStaff>}

                        </div>
                        : <img src={WelcomImg} />
                }
            </div>
        )
    }
}