import React from 'react';

import {Row,Col,Form,Button} from 'antd';

import {Link} from 'react-router-dom';

import globalConfig from '../../config/config'

import { ViewPictureWall } from '../common/index';

import {map,keysIn} from 'lodash';

class UtilsView extends React.Component {
    constructor(props){
        super(props);        
    }

    normalColStyle = {
        xs: { span:24},
        sm: { span: 8},
    }

    titleStyle = {
        fontSize: "16px",
        // height: "50px",
        // lineHeight: "50px",
        paddingBottom: "20px",
        marginBottom: "20px",
        color: "rgba(0, 0, 0, 0.85)",
        fontWeight: "bold",       
        borderBottom: "1px solid #ccc"     
    };
    titleNoneStyle = {
        fontSize: "16px",
        marginBottom: "20px",
        color: "rgba(0, 0, 0, 0.85)",
        fontWeight: "bold",       
        // borderBottom: "1px solid #ccc"     
    };

    wrapBorderStyle = {
        border:'1px solid rgb(192, 192, 192)',margin: '0 15px 20px',padding: '10px 20px'
    }

    formItemOneLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 6}
        },
        wrapperCol: {
            xs: { span: 24},
            sm: { span: 18}
        }
    };
    uploadStyle = {padding: '2px 15px'}//{marginRight:'15px',border: '1px solid rgb(192, 192, 192)',color: 'rgba(0, 0, 0, 0.85)',padding: '2px 5px'}
    dicomStyle = {padding: '2px 5px', display: 'block'}

    renderTitle =(item,i)=>{
        let style = {}
        if (item.style&&item.style=='borderNone') {
            style = this.titleNoneStyle;
        } else if (item.style&&item.style !='borderNone') {
            style = item.style;
        } else {
            style = this.titleStyle;
        }
        return (
            <Row key={i}>
                <Col>
                    <p style={style}>{item.title}</p>
                </Col>
            </Row>
        )
    }

    renderColItemText = (col)=>(
        <Form.Item {... col.itemStyle || this.formItemOneLayout} label={col.label}>
            <div>{col.text|| ''}</div>
        </Form.Item>
    )

    renderColItemImg = (col)=>(
        <Form.Item {... col.itemStyle || this.formItemOneLayout} label={col.label}>
            {/* <img src={globalConfig.ApiUrl+'/'+col.src || '' }/> */}
            <ViewPictureWall  picArr = {col.src||''} />
        </Form.Item>  
    )

    renderColItemUpload = (col) => (
        <Form.Item {... col.itemStyle || this.formItemOneLayout} label={col.label}>
            {col.upload&&col.upload.map((item,i) => <p style={{whiteSpace:'nowrap'}} key={i}><a href={globalConfig.ApiUrl+(item.url||item.value||'')} target="_blank" title={item.name} style={this.uploadStyle}>{item.name}</a></p>)}
        </Form.Item>
    )
    renderColItemDicom = (col) => (
        <Form.Item {... col.itemStyle || this.formItemOneLayout} label={col.label}>
            {col.dicom&&col.dicom.map((item,i) => <a style={this.dicomStyle} onClick={()=>{window.open(item.url)} }>{item.name}</a>)}
        </Form.Item>
    )

    renderColItemRichText = (col)=>{
        if( col.label && col.label.length >0){
            return (
                <Form.Item {... col.itemStyle || this.formItemOneLayout} label={col.label}>
                    <div dangerouslySetInnerHTML={{__html:col.richText}} className='imageDiv' style={{wordWrap: 'break-word',width:'100%',lineHeight:'1', marginTop:'12px'}}></div>                
                </Form.Item>
            );
        }
        else {
            return <div dangerouslySetInnerHTML={{__html:col.richText}} className='imageDiv' style={{wordWrap: 'break-word',width:'100%',lineHeight:'1', marginTop:'12px'}}></div>;
        }
    }

    renderColItemLink =(col) =>{
        return(
            // <Form.Item {... col.itemStyle || this.formItemOneLayout}>
            //     <a href={col.href || ''} >{col.hrefText|| ''}</a>
            // </Form.Item>

            <a href={col.href || ''} >{col.hrefText|| ''}</a>
        );
    }

    renderColCustomerItem = (col) =>{
        return (
            <Form.Item {... col.itemStyle || this.formItemOneLayout} label={col.label}>
                {col.render()}
            </Form.Item> 
        );
    }

    //col 列设置
    renderColItem = (col,i)=>{
        let tempArr  = keysIn(col);
        if(tempArr.indexOf('text') >-1){
            return (
                <Col {... col.colStyle || this.normalColStyle} key={i}>                 
                    {this.renderColItemText(col)}
                </Col>
            )
        }
        if(tempArr.indexOf('src')>-1) {
            return (
                <Col {... col.colStyle || this.normalColStyle} key={i}>  
                    {this.renderColItemImg(col)}
                </Col>
            )
        }
        if(tempArr.indexOf('upload')>-1) {
            return (
                <Col {... col.colStyle || this.normalColStyle} key={i}>  
                    {this.renderColItemUpload(col)}
                </Col>
            )
        }
        if(tempArr.indexOf('dicom')>-1) {
            return (
                <Col {... col.colStyle || this.normalColStyle} key={i}>  
                    {this.renderColItemDicom(col)}
                </Col>
            )
        }
        if(tempArr.indexOf('richText')  >-1){
            return (
                <Col {... col.colStyle || this.normalColStyle} key={i}>
                    {this.renderColItemRichText(col)}
                </Col>
            )
        }
        if(tempArr.indexOf('hrefText') >-1){
            return (
                <Col {... col.colStyle || this.normalColStyle} key={i}>
                    {this.renderColItemLink(col)}
                </Col>
            )
        }
        if(tempArr.indexOf('render') >-1){
            return (
                <Col {... col.colStyle || this.normalColStyle} key={i}>
                    {this.renderColCustomerItem(col)}
                </Col>
            )
        }
    }

    // row 行设置
    renderCols = (item,i)=>{
        let wrapStyle = {}
        if (item.cols.style&&item.cols.style=='border'){
            wrapStyle = this.wrapBorderStyle;
            return (
                <Row style={wrapStyle} key={i}>
                   {map(item.cols.colsData,(col,i)=>
                        this.renderColItem(col,i)
                    )}
                </Row>
            );
        } else {
            return (
                <Row style={wrapStyle} key={i}>
                   {map(item.cols,(col,i)=>
                        this.renderColItem(col,i)
                    )}
                </Row>
            );   
        }
    }

    renderCustomerItem = (item,i)=>{
        return (
            <Row key={i}>                            
                <Col {...item.colStyle||{}}>
                    {item.render()}
                </Col>
            </Row>
        );        
    }

    renderView= (items)=>( 
        map(items,(item,i)=>{
            if(keysIn(item).indexOf('title')>-1){
                return this.renderTitle(item,i);
            }
            if(keysIn(item).indexOf('cols')>-1){
                return this.renderCols(item,i);
            }
            if(keysIn(item).indexOf('render')>-1){
                return this.renderCustomerItem(item,i);
            }
        })
    )

    render(){
        return( 
            <div> 
                {this.renderView(this.props.items)}
            </div>
        )
    }
}

export {UtilsView }; 