import React from 'react';
import { Row, Col } from 'antd';
import './PassWordStrength.less'
class PassWordStrength extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isStrength : 0
        };
    }

    componentWillReceiveProps (nextProps){
        let val = nextProps.value;
        let lv = 0;
        if(val) {
            if(val.match(/[a-z]/g)){lv++;} 
            if(val.match(/[0-9]/g)){lv++;}
            if(val.match(/[A-Z]/g)){lv++;}
            if(val.match(/(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,.\/])/g)){lv++;}
            if (lv != 0) {
                this.setState({isStrength:lv})
            }
        } else {
            this.setState({isStrength : 0})
        }
    }

    render() {
        let isStrength = this.state.isStrength;
        let color = {};
        let stateNameArr = []
        if (isStrength == 1) {
            color = {backgroundColor:'rgb(255, 0, 0)'};
            stateNameArr= ['弱','','']
        } else if (isStrength == 2 || isStrength == 3) {
            color = {backgroundColor:'rgb(255, 196, 0)'}
            stateNameArr= ['','中','']
        } else if (isStrength > 3) {
            color = {backgroundColor:'rgb(0, 255, 0)'}
            stateNameArr= ['','','强']
        }

        return (
            <div className='strength-body'>
                {isStrength != 0 && 
                    <div className='strength-wrap'>
                        <Row gutter={4}>
                            {isStrength != 0&&
                                <Col span={8}>
                                    <div className="strengt-weak" style={color}></div>
                                </Col>
                            }
                            {isStrength >=2 &&
                                <Col span={8}>
                                    <div className="strengt-medium" style={color}></div>
                                </Col>
                            }
                            {isStrength > 3&&
                                <Col span={8}>
                                    <div className="strengt-strong" style={color}></div>
                                </Col>
                            }
                        </Row>
                    </div>
                }
                {isStrength != 0 && 
                    <Row gutter={4}>
                        <Col span={8} className='text-c'>
                            <span>{stateNameArr[0]}</span>
                        </Col>
                        <Col span={8} className='text-c'>
                            <span>{stateNameArr[1]}</span>
                        </Col>
                        <Col span={8} className='text-c'>
                            <span>{stateNameArr[2]}</span>
                        </Col>
                    </Row>
                }
            </div>
        )
    }
}

export default PassWordStrength