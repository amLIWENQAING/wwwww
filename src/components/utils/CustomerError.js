import React from 'react';
import {Form} from 'antd';

const CustomerError =(props)=>{
    const onChange  = ()=>{
        alert('asdfasdf');        
    }    

    let childrenProps = {
        onChange:onChange,
    }

    childrenProps = assign({},props.children.props,childrenProps); 

    let createElement = (children)=>{
        return React.createElement(children.type.name, childrenProps, children.children||null);
    }

    if(props.errorMessage  && props.errorMessage.length >0){
        return(
        <Form.Item style={props.style} labelCol={props.labelCol} wrapperCol ={props.wrapperCol} validateStatus='error' help={props.errorMessage} label={props.label}>
            {/* {props.children} */}
            { createElement(props.children)}
        </Form.Item>)
    }
    else{
        return(
            <Form.Item style={props.style} labelCol={props.labelCol} wrapperCol ={props.wrapperCol} label = {props.label}>
                {/* {props.children} */}
                { createElement(props.children) }
            </Form.Item>
        )
    }        
}

export {CustomerError};