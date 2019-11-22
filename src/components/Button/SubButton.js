import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'antd';

class SubButton extends React.Component {
    constructor(props){
        super(props);
        let dataType = this.props.dataType?this.props.dataType:'';
        this.state = {
            size: 'default',
            loading:false,
            dataType
        } 
    }

    load = (e) => {
        this.setState({ loading: true })
        this.props.onClick(e,this.finish)
    }

    finish = () => {
        this.setState({ loading: false })
    }

    render() {
        const loading = this.state.loading;
        const size = this.state.size;
        const dataType = this.state.dataType;
        const style = this.props.style;
    	return (
    		<Button 
                type="primary" 
                htmlType="submit"
                // data-type={dataType}
                disabled={this.props.disabled}
                size={size} 
                style={style}
                loading = {loading}
                onClick = {this.load}
            >{loading?this.props.children + '中':this.props.children}</Button>
        )
    }

}

export default SubButton