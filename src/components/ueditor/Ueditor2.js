import React from 'react';

class UeditorDiv extends React.Component {
    constructor(props){
        super(props);
    }

    componentDidMount(){
        // 标记 div 初始完毕
        if(this.props.initDiv){
            this.props.initDiv()
        }
    }

    render(){
        return <div  type="text/plain" id={this.props.editorId} className="ueditor" name="content"></div>
    }
}

class Ueditor2 extends React.Component {
    constructor(props){
        super(props);

        this.state={
            IsUeditorDivReady : false,
        }
    }

    render(){
        let self  = this;
        if(window.UE){
            let UE = window.UE;
            let editor  = window.UE.getEditor(this.props.editorId);
            if(! editor){
                editor = window.UE.getEditor(this.props.editorId);

                editor.addListener('ready',(editor)=>{
                    
                    if(this.props.content){
                        editor.setContent(self.props.content|| '');
                    }      
            
                    if(self.props.onReady){
                        self.props.onReady(self.ueEditor);
                    }

                    editor.addListener('contentChange', function(editor){
                        if(self.props.onChange){
                          self.props.onChange();
                        }
                    });
                });
            }
        }
        else{
          console.log('未能加载 ueEditor');
        }

        return '';
    }
}