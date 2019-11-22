import React from 'react';
import { Form, Input, Button, Select, Row, ColForm, Col, Icon, DatePicker, Radio, Checkbox, Cascader, Upload } from 'antd';
import { UPPPicturesWall, CustomPictureWall } from '../../components/common/index';
import BraftEditor from '../../components/braftEditor/index';
import { UEditor } from '../ueditor/Ueditor';
import { UPPUpload, CustomUpload } from '../common/index';
import moment from 'moment';
import { map, keysIn } from 'lodash';

const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const RangePicker = DatePicker.RangePicker;

class CustomerForm extends React.Component {

    constructor(props) {
        super(props);

        // this.getFieldDecorator = props.form.getFieldDecorator;
    }

    componentDidMount() {
        this.excuteFun(this.props.form, this.props.initForm);
    }

    normalColStyle = {
        xs: { span: 24 },
        sm: { span: 12 },
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

    formItemOneLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 6 }
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 18 }
        }
    };

    getFieldDecorator = this.props.form.getFieldDecorator;

    excuteFun = (paras, callback) => {

        if (callback) {
            callback(paras);
        }
    }

    renderText = (text) => {
        if (text.constructor.name == 'Function')
            return text();
        else
            return text;
    }

    renderTitle = (item) => (
        <Row>
            <Col>
                <p style={item.titleStyle ? item.titleStyle : this.titleStyle}>{this.renderText(item.title)}</p>
            </Col>
        </Row>
    )

    // text
    // option:  itemStyle , 
    //  initialValue 
    renderColItemText = (col) => (
        <Form.Item {...col.itemStyle || {}} label={col.label}>
            <span style={col.textStyle ? col.textStyle : { fontSize: '14px' }}>{col.initialValue}</span>
        </Form.Item>
    )
    // input
    // option:  itemStyle , 
    // required:   lablel , id , option , placeholder ,selectBefore
    // units 后缀单位,如元，人等
    renderColItemInput = (col) => (
        <Form.Item {...col.itemStyle || {}} label={col.label}>
            {this.getFieldDecorator(col.id, col.option)(<Input suffix={col.units ? <span dangerouslySetInnerHTML={{ __html: col.units }}></span> : null} onChange={col.onChange} placeholder={col.placeholder || ''} {...col.itemProps} />)}
        </Form.Item>
    )

    // TextArea 
    renderColItemTextArea = (col) => (
        <Form.Item {...col.itemStyle || {}} label={col.label}>
            {this.getFieldDecorator(col.id, col.option)(<Input.TextArea placeholder={col.placeholder || ''} {...col.itemProps} />)}
        </Form.Item>
    )

    // img
    // option:  itemStyle
    // required:  lablel , id , option , size, title, getPictures, initialValue ,  
    renderColItemImg = (col) => (
        <div>
            <Form.Item {...col.itemStyle || {}} label={col.label}>
                {this.getFieldDecorator(col.id, col.option)(
                    <UPPPicturesWall
                        size={col.size}
                        title={col.title}
                        getPictures={(imgList) => this.excuteFun(imgList, col.onChange)}
                        accept={'image/*'}
                        initialValue={col.initialValue}
                        beforeUpload={col.beforeUpload}
                    >
                    </UPPPicturesWall>
                )}
            </Form.Item>
            {col.bottomTitle &&
                <Row>
                    <Col span={2}></Col>
                    <Col span={22}><div style={{ color: 'rgb(28,158,215)', lineHeight: '16px' }}>{col.bottomTitle || ''}</div>
                    </Col>
                </Row>
            }
        </div>
    )

    // customImg
    // option:  itemStyle
    // required:  lablel , id , option , size, title, getPictures, initialValue ,  
    renderColItemCustomImg = (col) => (
        <div>
            <Form.Item {...col.itemStyle || {}} label={col.label}>
                {this.getFieldDecorator(col.id, col.option)(
                    <CustomPictureWall
                        size={col.size}
                        title={col.title}
                        onChange={(imgList) => this.excuteFun(imgList, col.onChange)}
                        accept={'image/*'}
                        notice={col.notice || ''}
                        fileList={col.fileList}
                        beforeUpload={col.beforeUpload}
                        defaultFileList={col.defaultFileList}
                    >
                    </CustomPictureWall>
                )}
            </Form.Item>
            {col.bottomTitle &&
                <Row>
                    <Col span={4}></Col>
                    <Col span={20}><div style={{ color: 'rgb(28,158,215)', lineHeight: '16px' }}>{col.bottomTitle || ''}</div>
                    </Col>
                </Row>
            }
        </div>
    )


    // radio
    // option:  itemStyle
    // required:  lablel , id , option , options {value: , text : }, onchange , 
    renderColItemRadio = (col) => (
        <Form.Item {...col.itemStyle || {}} label={col.label}>
            {this.getFieldDecorator(col.id, col.option)(
                <RadioGroup onChange={e => this.excuteFun(e, col.onChange)} disabled={col.disabled || false}>
                    {map(col.options, (x, index) => { return <Radio key={index} value={x.value}>{x.text}</Radio> })}
                </RadioGroup>
            )}
            {col.bottomTitle && <div style={{ color: 'rgb(28,158,215)', lineHeight: '16px' }}>{col.bottomTitle || ''}</div>}
        </Form.Item>
    )
    renderColItemCheckbox = (col) => (
        <Form.Item {...col.itemStyle || {}} label={col.label}>
            {this.getFieldDecorator(col.id, col.option)(
                <CheckboxGroup
                    options={col.options}
                    onChange={col.onChange}
                />
            )}
            {col.bottomTitle && <div style={{ color: 'rgb(28,158,215)', lineHeight: '16px' }}>{col.bottomTitle || ''}</div>}
        </Form.Item>
    )

    //空白占位
    renderColItemBlank = (col) => (
        <div style={{ height: '63px' }}></div>
    )

    // password 
    renderColItemPassword = (col) => (
        <Form.Item {...col.itemStyle || {}} label={col.label}>
            {this.getFieldDecorator(col.id, col.option)(<Input type='password' placeholder={col.placeholder || ''} {...col.itemProps} />)}
        </Form.Item>
    )

    // datePicker
    // getCalendarContainer={triggerNode => triggerNode.parentNode} 解决选项框随页面滚动分离问题
    renderColItemDatePicker = (col) => (
        <Form.Item {...col.itemStyle || {}} label={col.label}>
            {this.getFieldDecorator(col.id, col.option)(
                <DatePicker disabledDate={col.disabledDate} showTime={col.noshowTime ? false : true} format={col.format ? col.format : "YYYY-MM-DD HH:mm:ss"} placeholder={col.placeholder || ''} style={{ width: '100%' }}
                    getCalendarContainer={triggerNode => triggerNode.parentNode} />
            )}
        </Form.Item>
    )
    // RangePicker
    // showTime={{defaultValue:[moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')]}}
    // getCalendarContainer={triggerNode => triggerNode.parentNode} 解决选项框随页面滚动分离问题
    renderColItemRangePicker = (col) => (
        <Form.Item {...col.itemStyle || {}} label={col.label}>
            {this.getFieldDecorator(col.id, col.option)(
                <RangePicker disabledDate={col.disabledDate} showTime format="YYYY-MM-DD HH:mm:ss" placeholder={col.placeholder || ''} style={{ width: '100%' }}
                    getCalendarContainer={triggerNode => triggerNode.parentNode}
                />
            )}
        </Form.Item>
    )

    // Cascader
    // getPopupContainer={triggerNode => triggerNode.parentNode} 解决选项框随页面滚动分离问题
    renderColItemCascader = (col) => (
        <Form.Item {...col.itemStyle || {}} label={col.label} >
            {this.getFieldDecorator(col.id, col.option)(
                <Cascader options={col.options} disabled={col.disabled || false} showSearch onChange={(value, selectedOptions) => this.excuteFun(selectedOptions, col.onChange)} style={{ width: '100%' }} placeholder={col.placeholder || ''}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                />
            )}
        </Form.Item>
    )

    // select 
    // option: itemStyle
    // required : label, id , option , onChange, placeholder ,  options {text , value}
    // getPopupContainer={triggerNode => triggerNode.parentNode} 解决选项框随页面滚动分离问题
    renderColItemSelect = (col) => (
        <Form.Item {...col.itemStyle || {}} label={col.label} >
            {this.getFieldDecorator(col.id, col.option)(
                <Select onChange={(value, selectedOptions) => this.excuteFun(selectedOptions, col.onChange)}
                    style={{ width: '100%' }} placeholder={col.placeholder || ''} optionFilterProp="children" showSearch={col.showSearch || false} disabled={col.disabled || false} mode={col.mode || ''}
                    getPopupContainer={triggerNode => triggerNode.parentNode}>
                    {map(col.options, (x, index) => <Select.Option key={index} value={x.value}>{x.text}</Select.Option>)}
                </Select>
            )}
        </Form.Item>
    )

    // uPPUpload
    renderUPPUpload = (col) => (
        <Form.Item {...col.itemStyle || {}} label={col.label} >
            {this.getFieldDecorator(col.id, col.option)(
                <UPPUpload
                    title={col.title || "上传附件"}
                    getAttachments={fileList => this.excuteFun(fileList, col.onChange)}
                    defaultinitialValue={col.defaultinitialValue || []} >
                </UPPUpload>
            )}
        </Form.Item>
    )

    // 修改 uppUpload 的一个版本
    renderCustomUpload = (col) => (
        <Form.Item {...col.itemStyle || {}} label={col.label} >
            {this.getFieldDecorator(col.id, col.option)(
                <CustomUpload
                    title={col.title || "上传附件"}
                    notice={col.notice || ''}
                    beforeUpload={col.beforeUpload}
                    getAttachments={fileList => this.excuteFun(fileList, col.onChange)}
                    fileList={col.fileList || []}
                    size={col.size}
                    accept={col.accept}
                >
                </CustomUpload>
            )}
        </Form.Item>
    )

    //  上传视频
    renderVideoUpload = (col) => (
        <Form.Item {...col.itemStyle || {}} label={col.label} >
            {this.getFieldDecorator(col.id, col.option)(
                <CustomUpload
                    title={col.title || "上传附件"}
                    beforeUpload={col.beforeUpload}
                    notice={col.notice || ''}
                    getAttachments={fileList => this.excuteFun(fileList, col.onChange)}
                    fileList={col.fileList || []}
                    size={col.size}
                    accept={'video/mp4'}
                >
                </CustomUpload>
            )}
        </Form.Item>
    )

    renderColItemRender = (col) => {
        let self = this;
        return (
            <Form.Item {...col.itemStyle || {}} label={col.label} >
                {col.render(self.props.form)}
            </Form.Item>
        );
    }
    // richInput11
    // option:  itemStyle
    // required: lablel , id , option , height（默认200）
    renderRichText1 = (col) => {
        return (
            <Form.Item {...col.itemStyle || {}} label={col.label}>
                {this.getFieldDecorator(col.id, col.option)(
                    <BraftEditor {...col} />
                )}
            </Form.Item>
        )
    }
    // UEditor
    // option:  itemStyle
    // required: lablel , id , option , editorId
    renderRichText = (col) => {
        // let option = this.getRichInputErrorOption(col.richInputOption);
        return (
            <Form.Item {...col.itemStyle || {}} label={this.renderText(col.label)} >
                {this.getFieldDecorator(col.id, col.option)(
                    // <div style={this.getRichInputErrorStyle(col.richInputOption.error)} >
                        <UEditor editorId={col.editorId} {...col} ref={(editor) => { this.excuteFun(editor, col.refFun) }} />
                    // </div>
                )}
            </Form.Item>
        )
    }

    getRichInputErrorStyle = (isError) => {
        if (isError) {
            return { border: '1px solid red', borderRadius: '5px' };
        }
        return null;
    }

    getRichInputErrorOption = (richInputOption) => {
        if (richInputOption.error) {
            return {
                validateStatus: 'error',
                help: richInputOption.errorMsg || '',
            }
        }
        return {};
    }


    renderColItem = (col) => {
        try {
            let allFun = {

                text: this.renderColItemText,

                input: this.renderColItemInput,

                textArea: this.renderColItemTextArea,

                radio: this.renderColItemRadio,

                checkbox: this.renderColItemCheckbox,

                blank: this.renderColItemBlank,

                password: this.renderColItemPassword,

                datePicker: this.renderColItemDatePicker,

                rangePicker: this.renderColItemRangePicker,

                cascader: this.renderColItemCascader,

                select: this.renderColItemSelect,

                img: this.renderColItemImg,

                customImg: this.renderColItemCustomImg,

                richText: this.renderRichText1,

                ueditor: this.renderRichText,

                uppUpload: this.renderUPPUpload,

                customUpload: this.renderCustomUpload,

                videoUpload: this.renderVideoUpload,

                render: this.renderColItemRender,
            };
            return allFun[col.type](col);
        }
        catch (error) {
            console.log(error);
        }
    }

    renderCols = (item, index) => (
        <Row key={index}>
            {map(item.cols, (col, index) =>
                <Col key={index} {...col.colStyle || this.normalColStyle}>
                    {this.renderColItem(col)}
                </Col>
            )}
        </Row>
    )

    renderCustomerItem = (item, index) => {
        return (
            <Row key={index}>
                <Col key={index} {...item.colStyle || this.normalColStyle}>
                    {item.render(this.props.form)}
                </Col>
            </Row>
        );
    }

    renderView = (items) => (
        map(items, (item, index) => {
            if (keysIn(item).indexOf('title') > -1) {
                return this.renderTitle(item, index);
            }
            if (keysIn(item).indexOf('cols') > -1) {
                return this.renderCols(item, index);
            }
            if (keysIn(item).indexOf('render') > -1) {
                return this.renderCustomerItem(item, index);
            }
        })
    )

    render() {
        return (
            <Form labelAlign={this.props.labelAlign||'right'} {...this.props.formItemOneLayout||this.formItemOneLayout}>
                {this.renderView(this.props.items)}
            </Form>
        )
    }
}


const UtilsForm = Form.create()(CustomerForm);
export { UtilsForm }