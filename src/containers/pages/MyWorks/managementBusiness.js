import React from 'react';

export default class ManagementBusiness extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            managementBusinessData: {}
        }
    }

    static getDerivedStateFromProps(props, state) {
        // 组件每次被rerender的时候，包括在组件构建之后(虚拟dom之后，实际dom挂载之前)，每次获取新的props或state之后;
        // 每次接收新的props之后都会返回一个对象作为新的state，返回null则说明不需要更新state
        let managementBusinessData = props.managementBusinessData;
        if (managementBusinessData !== state.managementBusinessData) {
            return {
                managementBusinessData
            }
        }
        return null
    }

    render() {
        let { managementBusinessData } = this.state;
        let chackName = [
            '活动资料',
            '课程资料',
            '需求资料',
            '评测资料',
            '职位资料',
        ]
        let ob = [
            {title:'activityCount', type:'0'},
            {title:'curriculumCount', type:'3'},
            {title:'demandCount', type:'2'},
            {title:'evaluationCount', type:'4'},
            {title:'positionCount', type:'1'},
        ]
        return (
            <div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', marginRight: '60px' }}>资料审核</span>
                    {ob.map((item, index) => {
                        let isshow = (managementBusinessData[item.title] + 0) ? 'block' : 'none';
                        return <div key={index} onClick={()=>this.props.getCheck(item.type)} style={{ cursor: 'pointer', position: 'relative', backgroundColor: "#1890ff", marginRight: "100px", borderRadius: '55%', width: "84px", height: '80px', textAlign: 'center' }}>
                            <span style={{ display: isshow, fontSize: '14px', width: '35px', height: '35px', fontWeight: 'bold', lineHeight: '35px', borderRadius: '50%', backgroundColor: 'red', color: '#fff', position: 'absolute', top: '-5px', right: '-5px' }}>
                                {(managementBusinessData[item.title] + 0) > 99 ? 99 + '+' : managementBusinessData[item.title] || 0}</span>
                            <img width='30' height='30' src="/images/check.svg" alt="" style={{ marginTop: '30%' }} />
                            <p style={{ width: '100%', fontSize: '14px', position: 'absolute', top: '110%', textAlign: 'center' }}>{chackName[index]}</p>
                        </div>
                    })}
                </div>
                <hr style={{ marginTop: '60px' }} />
            </div>
        )
    }
}