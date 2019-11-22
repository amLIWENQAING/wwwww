import React from 'react';
import globalConfig from '../../config/config';
window.UEDITOR_HOME_URL = '/public/utf8-php/dialogs';
window.GlobalConfig = globalConfig.ApiUrl;

class UEditor extends React.Component {
  constructor(props) {
    super(props);
    const value = props.value;
    this.state = {
      strContent: '',
      value: value,
      isFirst:true
    };
  }

  componentDidMount() {
    this.initUeditor();
  }
  componentWillReceiveProps(nextProps) {
    // 由于初始化数据为异步获取。判断是不是第一次渲染。然后渲染数据
    if (nextProps.value != this.props.value && this.state.isFirst) {
      this.setState({
        isFirst:false
      })
      this.setContent(nextProps.value)
    }
  }
  
  initUeditor = () => {
    let self = this;
    if (window.UE) {
      let ueEditor = window.UE.getEditor(this.props.editorId);
      console.log('ueEditor已加载------->>>', this.props.editorId);
      ueEditor.addListener('ready',()=>{
              
        if (this.props.value) {
            ueEditor.setContent(self.props.value|| '');
          }      
  
          // if(self.props.onReady){
          //     self.props.onReady(ueEditor);
          // }

          ueEditor.addListener('contentChange', function(){
              self.onChange()
          });

          // self.ueEditor = ueEditor;
      });  
    } else {
      console.log('未加载编辑器');
    }
  }
  componentWillUnmount() {
    // 组件卸载后，清除放入库的id
    let UE = window.UE;
    if (UE) {
      UE.getEditor(this.props.editorId).destroy();
      console.log('ueEditor已卸载----->',this.props.editorId);

    }
  }
  onChange = () => {
    if (this.props.onChange) {
      let value = this.getContent();
      this.props.onChange(value);
    }
  }
  getContent = () => {
    let result = window.UE.getEditor(this.props.editorId).getContent();
    return result;
  }

  hasContents = () => {
    let result = window.UE.getEditor(this.props.editorId).hasContents();
    return result;
  }

  getContentLength = () => {
    let result = window.UE.getEditor(this.props.editorId).getContentLength(true);
    return result;
  }
  setContent = (str) => {
      window.UE.getEditor(this.props.editorId).setContent(str, false);
  }

  render() {
    return (
      <div>
        <div type="text/plain" id={this.props.editorId} style={{width:'100%',height:'500px'}}>
        </div>
      </div>
    )
  }
}
export { UEditor };