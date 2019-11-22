import React from 'react';
// import '../../utils/ueditor-utf8-net/ueditor.config.js';       
// import '../../utils/ueditor-utf8-net/ueditor.all.min.js';
// import '../../utils/ueditor-utf8-net/lang/zh-cn/zh-cn.js';
window.UEDITOR_HOME_URL = '/public/utf8-php/dialogs';

class UEditor extends React.Component {
 constructor(props){
   super(props);
   this.state={
     isReady: false,
     strContent: '',
     didMount : false,
   };
  }

//  componentWillReceiveProps (props){
//   //  if(props.initContent != this.props.initContent && this.state.isReady){     
//   //    this.setContent(props.initContent);
//   //  }
//  }

 componentDidMount(){

    // let self = this;
    // if(! self.ueEditor){
    //   let UE = window.UE;

    //   let editor = UE.getEditor(self.props.editorId, {
    //     maximumWords:2000
    //   });
    //   editor.addListener('ready',(editor)=>{
    //     self.ueEditor  = UE.getEditor(self.props.editorId);
    //     // self.ueEditor.reset();
        
    //     if(this.props.content){
    //       self.ueEditor.setContent(self.props.content|| '');
    //     }
    //     else if(this.state.strContent){
    //       self.ueEditor.setContent(self.state.strContent);
    //     }        

    //     self.setState({isReady: true},()=>{
    //       if(self.props.onReady){
    //         self.props.onReady(self.ueEditor);
    //       }  
    //       self.ueEditor.addListener('contentChange', function(editor){
    //         if(self.props.onChange){
    //           self.props.onChange();
    //         }
    //       });
    //     })
    //   });
    // } 
    this.initUeditor();
 }

 initUeditor = ()=>{
   let self = this;
  if(window.UE){
      let UE = window.UE;
      if(! self.ueEditor){
          console.log('render ueditor')

          let ueEditor = window.UE.getEditor(this.props.editorId);

          ueEditor.addListener('ready',(editor)=>{
              
              if(this.props.content){
                  editor.setContent(self.props.content|| '');
              }      
      
              if(self.props.onReady){
                  self.props.onReady(ueEditor);
              }

              ueEditor.addListener('contentChange', function(editor){
                  if(self.props.onChange){
                    self.props.onChange();
                  }
              });

              self.ueEditor = ueEditor;

              self.setState({didMount:true});
          });          
      }
  }
  else{
    console.log('未能加载 ueEditor');
  }
 }

 componentWillUnmount() {
      // 组件卸载后，清除放入库的id
      let UE = window.UE;

      if(UE && this.state.isReady){
        UE.getEditor(this.props.editorId).destroy();
      }
 }

 getContent = ()=> {
   let self  = this;
   let result = self.ueEditor.getContent();

   return result;
 }

 hasContents = ()=>{
  let self  = this;
  let result = self.ueEditor.hasContents();

  return result;
 }

 getContentLength = () => {
   let self = this;
   let result = self.ueEditor.getContentLength(true);
   return result;
 }

 setContent = (str)=> {
   let self = this;
   if(this.state.isReady){
      self.ueEditor.setContent(str, false);
   }
   else{
      self.setState({strContent: str});
   }
   
 }
 
 render(){
  // debugger;
  if(! this.state.didMount){
    this.initUeditor();
  }
   

  return (
    <div>
      <div  type="text/plain" id={this.props.editorId} className="ueditor" name="content">
      </div>
    </div>
   )
 }
}
export {UEditor};