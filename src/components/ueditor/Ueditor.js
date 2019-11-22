import React from 'react';
import globalConfig from '../../config/config';
import { Modal, Button } from 'antd';
window.UEDITOR_HOME_URL = '/public/utf8-php/dialogs';
window.GlobalConfig = globalConfig.ApiUrl;

class UEditor extends React.Component {
  constructor(props) {
    super(props);
    const value = props.value;
    this.state = {
      strContent: '',
      value: value,
      isFirst: true,
      visible: false
    };
  }

  componentDidMount() {
    this.initUeditor();
  }
  componentWillReceiveProps(nextProps) {
    // 由于初始化数据为异步获取。判断是不是第一次渲染。然后渲染数据
    if (nextProps.value != this.props.value ) {
      this.setState({
        value:nextProps.value
      }, () => {
          if (this.state.isFirst) {
            setTimeout(() => {
              this.setContent(nextProps.value);
              this.setState({
                isFirst:false
              })
            }, 1000)
          }
      })
    }
  }
  showModal = () => {
    this.setState({
      visible: true,
    }, () => {
        setTimeout(() => {
      this.initUeditor()
          
        },500)
    });
  };

  hideModal = () => {
    this.setState({
      visible: false,
    }, () => {
      let UE = window.UE;
      if (UE) {
        UE.getEditor(this.props.editorId).destroy();
        console.log('ueEditor已卸载----->', this.props.editorId);
      }
    });
  };


  initUeditor = () => {
    let self = this;
    if (window.UE) {
      let ueEditor = window.UE.getEditor(this.props.editorId);
      console.log('ueEditor已加载------->>>', this.props.editorId);
      ueEditor.addListener('ready', () => {

        if (this.props.value&&ueEditor) {
          ueEditor.setContent(self.props.value || '');
        }

        // if(self.props.onReady){
        //     self.props.onReady(ueEditor);
        // }
        this.setFocus();

        ueEditor.addListener('contentChange', function () {
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
    // if (UE&&this.state.visible) {
    if (UE) {
      UE.getEditor(this.props.editorId).destroy();
      console.log('ueEditor已卸载----->', this.props.editorId);
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
    window.window.UE.getEditor(this.props.editorId).setContent(str, false);
  }

  setFocus = () => {
    window.UE.getEditor(this.props.editorId).focus();
  }

  render() {
    // console.log('uedtorContent=>', this.state.value);
    return (
      <div>
        <div type="text/plain" id={this.props.editorId} style={{ width: '100%', height: '500px' }}></div>
        {/*<div style={{ maxHeight:'500px',minHeight:'40px',overflow:'hidden',overflowY:'auto',wordWrap: 'break-word', border: '1px #ddd solid', borderRadius: '5px',paddingLeft:'10px' }}>
          <div dangerouslySetInnerHTML={{ __html: this.state.value }} style={{ wordWrap: 'break-word' }}></div>
        </div>
          <Button type="primary" onClick={this.showModal}>
            打开文本编辑器
          </Button>
        <Modal
          title={'文本编辑器-' + this.props.label}
          visible={this.state.visible}
          onOk={this.hideModal}
          onCancel={this.hideModal}
          width='90%'
          okText="确认"
          cancelText="取消"
          footer={<Button onClick={this.hideModal} type='primary'>确认</Button>}
          >
            <div type="text/plain" id={this.props.editorId} style={{ width: '100%', height: '500px' }}></div>

          </Modal>*/}
        </div>
    )
  }
}
export { UEditor };