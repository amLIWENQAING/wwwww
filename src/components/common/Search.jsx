import React from 'react';
import {
  Form,
  Row,
  Col,
  Input,
  Select,
  Button,
  Icon,
  DatePicker
} from 'antd';
import moment from 'moment';
import '../../content/css/datePicker/datePicker.css';
const FormItem = Form.Item;
const Option = Select.Option;
const {RangePicker} = DatePicker;
class AdvancedSearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: false,
      size: 'default',
      linkage:[]
    };

    this.resetFieldsFun=[];    // {name:'',fun:()=>void}
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.isResetField != this.props.isResetField){
      if(this.props.form){
        this.props.form.resetFields();
      }
    }
  }

  handleSearch = (e) => {
    e.preventDefault();
    this
      .props
      .form
      .validateFields((err, values) => {
        if(!err){
          for(let key in values){
            if(!values[key]){
              delete values[key];//排除未定义的搜索条件
            }
          };
          this.props.getSearchFields(values);
        }
      });
  }

  handleReset = () => {    
    this.runFun(this.props.resetField,this.props.form);
    this
      .props
      .form
      .resetFields();
    for(let f in this.resetFieldsFun){
      if(this.resetFieldsFun[f] && this.resetFieldsFun[f].fun){
        this.resetFieldsFun[f].fun(this.props.form);
      }
    }
    this.props.getSearchFields(null);
  }

  toggle = () => {
    const {expand} = this.state;
    this.setState({
      expand: !expand
    });
  }

  /**
   * 处理级联
   * 
   * @memberof AdvancedSearchForm
   */
  handleLinkage=(e)=>{
    const selectData=this.props.selectData;
    if(selectData && selectData.length>0){
      selectData.map((item)=>{
        if(item.value===e && item.children && item.children.length>0){
          this.setState((prevState) => {
            prevState.linkage=item.children;
          });
          this.props.searchFields.map((item1)=>{
            if(item1.linkage){
              let objStr=`{"${item1.name}":""}`;
              const obj=JSON.parse(objStr);
              this.props.form.setFieldsValue(obj);
            }
          })
        }
      })
    };
    // console.log(this.state.linkage);
  }

  filterOption =(inputValue, option) => {
    console.log(inputValue, option)
    if (option.props.children.indexOf(inputValue) != -1) {
      return true
    }
  }

  runFun=(fun,e)=>{
    if(fun){
      fun(e,this.props.form)
    }
  }

  // To generate mock Form.Item
  getFields() {
    const count = this.state.expand
      ? 10
      : 3;
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {
        span: 5
      },
      wrapperCol: {
        span: 19
      }
    };
    const searchFields = this.props.searchFields;
    const children = [];
    const {size} = this.state;
    for (let i = 0; i < searchFields.length; i++) {
      const type = searchFields[i].type;
      let fieldElement = '<Input placeholder="placeholder" />';
      switch (type) {
        case "text":
          fieldElement = <Input placeholder={searchFields[i].placeholder}/>;
          break;
        case "select" : 
          const linkageData=this.state.linkage;
          //onChange={this.handleLinkage}
          fieldElement = searchFields[i].isLinkage?(<Select placeholder={searchFields[i].placeholder} >
            {
              searchFields[i].options&&searchFields[i].options.length>0&&searchFields[i].options.map((item,index)=><Option value={item.value} key={index}>{item.text}</Option>)
            }
          </Select>):(<Select placeholder={searchFields[i].placeholder}  onChange={(e)=>{this.runFun(searchFields[i].onChange,e)}}>
            {
              linkageData&&linkageData.length>0&&linkageData.map((item,index)=><Option value={item.value} key={index}>{item.text}</Option>)
            }
          </Select>);
          if(!searchFields[i].isLinkage && !searchFields[i].linkage){
            if (searchFields[i].mode&& searchFields[i].mode == "search") {//多选并有搜索功能
              fieldElement = (<Select placeholder={searchFields[i].placeholder} mode="multiple"
              filterOption={this.filterOption}
              style={{ width: '100%' }}
              onChange={(e)=>{this.runFun(searchFields[i].onChange,e)}}
              tokenSeparators={[',']}>
              {
                searchFields[i].options.map((item,index)=><Option value={item.value} key={index}>{item.text}</Option>)
              }
              </Select>)
            } else {
              fieldElement = (<Select placeholder={searchFields[i].placeholder} onChange={(e)=>{this.runFun(searchFields[i].onChange,e) }}>
              {
                searchFields[i].options.map((item,index)=><Option value={item.value} key={index}>{item.text}</Option>)
              }
              </Select>)
            }
            
          };
          break;
        case "date":
          fieldElement = <RangePicker size={size} style={{width:'100%'}}/>;
          break;
        case "dateTime":
          fieldElement = <RangePicker
            ranges={{
            Today: [
              moment(), moment()
            ],
            'This Month': [
              moment(), moment().endOf('month')
            ]
          }}
            showTime
            format="YYYY/MM/DD HH:mm:ss"
            onChange={this.onChange}/>;
          break;
        case 'render':
          fieldElement = searchFields[i].render(this.props.form, this.resetFieldsFun);
          break;
        default:
          fieldElement = <Input placeholder={searchFields[i].placeholder}/>
      }
      children.push(
        <Col
          span={(type !== "dateTime")
          ? 8
          : 10}
          key={i}
          style={{
          display: i < count
            ? 'block'
            : 'none',
          marginLeft: (type !== "dateTime")
            ? 0
            : -17
        }}>
          <FormItem {...formItemLayout} label={searchFields[i].title}>          
            {searchFields[i].type != 'render' && getFieldDecorator(searchFields[i].name)(fieldElement)}
            {searchFields[i].type == 'render' && fieldElement }
          </FormItem>
        </Col>
      );
    }
    return children;
  }
  onChange = (dates, dateStrings) => {
    // console.log('From: ', dates[0], ', to: ', dates[1]);
    // console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
  }
  render() {
    const {getFieldDecorator,setFieldsValue} = this.props.form;
    const searchFieldsAmount = this.props.searchFields.length;
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={40}>{this.getFields()}</Row>
        <Row>
          <Col span={24} style={{
            textAlign: 'right'
          }}>
            <Button type="primary" icon="search" htmlType="submit">搜索</Button>
            <Button
              style={{
              marginLeft: 8
            }}
              onClick={this.handleReset}>
              重置
            </Button>
            <a
              style={{
              marginLeft: 8,
              fontSize: 12,
              display: (searchFieldsAmount > 3)
                ? 'display'
                : 'none'
            }}
              onClick={this.toggle}>
              更多
              <Icon type={this.state.expand
                ? 'up'
                : 'down'}/>
            </a>
          </Col>
        </Row>
      </Form>
    );
  }
}

const UPPSearch = Form.create()(AdvancedSearchForm);
export {UPPSearch}