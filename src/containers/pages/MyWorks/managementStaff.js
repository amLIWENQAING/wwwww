import React from 'react';

export default class ManagementStaff extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            managementStaffData: {}
        }
    }

    static getDerivedStateFromProps(props, state) {
        // 组件每次被rerender的时候，包括在组件构建之后(虚拟dom之后，实际dom挂载之前)，每次获取新的props或state之后;
        // 每次接收新的props之后都会返回一个对象作为新的state，返回null则说明不需要更新state
        let managementStaffData = props.managementStaffData;
        if (managementStaffData !== state.managementStaffData) {
            return {
                managementStaffData: managementStaffData || {}
            }
        }
        return null
    }

    render() {
        let { managementStaffData } = this.state;
        let ob = [
            { title: 'capitalCount', name: '资金项目审核' },
            { title: 'parkCount', name: '园区项目审核' },
            { title: 'personnelCount', name: '人才项目审核' },
            { title: 'serbiceCount', name: '服务项目审核' },
            { title: 'technologyCount', name: '技术项目审核' },
        ]
        let outDivStyle = { display: 'flex', alignItems: 'center', marginTop: '20px' };
        let titleStyle = { fontSize: '16px', fontWeight: 'bold', marginRight: '60px' };
        let redNumStyle = { fontSize: '14px', width: '35px', height: '35px', fontWeight: 'bold', lineHeight: '35px', borderRadius: '50%', backgroundColor: 'red', color: '#fff', position: 'absolute', top: '-5px', right: '-5px' };
        let bottomStyle = { width: '100%', fontSize: '14px', position: 'absolute', top: '110%', textAlign: 'center' };
        return (
            <div>
                <div style={outDivStyle}>
                    <span style={titleStyle}>招聘管理</span>
                    {['BusinessMantPositionWork'].map((item, index) => {
                        let isshow = managementStaffData[item] + 0 ? 'block' : 'none';
                        return <div key={index} onClick={() => this.props.getCheck('BusinessMantPositionWork')} style={{ cursor: 'pointer', position: 'relative', backgroundColor: "#1890ff", marginRight: "100px", borderRadius: '55%', width: "84px", height: '80px', textAlign: 'center' }}>
                            <span style={{display: isshow,...redNumStyle}}>
                                {(managementStaffData[item] + 0) > 99 ? 99 + '+' : managementStaffData[item] || 0}</span>
                            <img width='30' height='30' src="/images/check.svg" alt="" style={{ marginTop: '30%' }} />
                            <p style={bottomStyle}>{'待审核'}</p>
                        </div>
                    })}
                </div>
                <hr style={{ margin: '60px 0' }} />
                <div style={outDivStyle}>
                    <span style={titleStyle}>需求管理</span>
                    {ob.map((item, index) => {
                        let isshow = managementStaffData['BusinessMantDemandWork'][item['title']] + 0 ? 'block' : 'none';
                        return <div key={index} onClick={() => this.props.getCheck('BusinessMantDemandWork', item['title'])} style={{ cursor: 'pointer', position: 'relative', backgroundColor: "#1890ff", marginRight: "100px", borderRadius: '55%', width: "84px", height: '80px', textAlign: 'center' }}>
                            <span style={{display: isshow,...redNumStyle}}>
                                {(managementStaffData['BusinessMantDemandWork'][item['title']] + 0) > 99 ? 99 + '+' : managementStaffData['BusinessMantDemandWork'][item['title']] || 0}</span>
                            <img width='30' height='30' src="/images/check.svg" alt="" style={{ marginTop: '30%' }} />
                            <p style={bottomStyle}>{item['name']}</p>
                        </div>
                    })}
                </div>
                <hr style={{ margin: '60px 0' }} />
                <div style={outDivStyle}>
                    <span style={titleStyle}>活动管理</span>
                    {['BusinessManActivityWork'].map((item, index) => {
                        let isshow = (managementStaffData[item] + 0) ? 'block' : 'none';
                        return  <div key={index} onClick={() => this.props.getCheck('BusinessManActivityWork')} style={{ cursor: 'pointer', position: 'relative', backgroundColor: "#1890ff", marginRight: "100px", borderRadius: '55%', width: "84px", height: '80px', textAlign: 'center' }}>
                            <span style={{display: isshow,...redNumStyle}}>
                                {(managementStaffData[item] + 0) > 99 ? 99 + '+' : managementStaffData[item] || 0}</span>
                            <img width='30' height='30' src="/images/check.svg" alt="" style={{ marginTop: '30%' }} />
                            <p style={bottomStyle}>{'待审核'}</p>
                        </div>
                    })}
                </div>
                <hr style={{ margin: '60px 0' }} />
            </div>
        )
    }
}