import React from 'react';
import Quill from'quill';
import '../../../node_modules/quill/dist/quill.snow.css';
class UPPEditor extends React.Component{
    constructor(props){
        super(props);
        this.state={
            'value':this.props.initialValue
        };
        this.props.getEditorContent(this.props.initialValue);
        this.editor=null;
    }
    handleChange () {  
        let {value}=this.state;  
        value = this.editor.root.innerHTML;  
        this.setState({value}); 
        // console.log(value); 
        this.props.getEditorContent(value);
    }
    componentDidMount(){
        // 工具栏选项设置
        const toolbarOptions = [  
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons  
            ['blockquote', 'code-block'],  
            [{ 'header': 1 }, { 'header': 2 }],               // custom button values  
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],  
            [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript  
            [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent  
            [{ 'direction': 'rtl' }],                         // text direction  
            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown  
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],  
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme  
            // [{ 'font': [] }],                                   //字体
            [{ 'align': [] }],  
            ['link', 'image', 'video'],  
            // ['clean']                                         // remove formatting button  
        ]; 
        const textbox =this.refs.textarea;
        const options = {  
            debug: 'warn',  //info
            modules: {
                // toolbar:  true  
                toolbar: toolbarOptions  
            },  
            placeholder: '请输入内容...',  
            readOnly: false,  
            theme: 'snow'
        };  
        const editor =this.editor= new Quill(textbox,options);  
        const {value}=this.state;  
        if (value) {
            editor.clipboard.dangerouslyPasteHTML(value);  
        }
        editor.on('text-change', this.handleChange.bind(this));

        this.focusEditor(editor);
    }    
    render(){
        return(<div ref="textarea" style={{minHeight:'150px'}}></div>)
    }

    focusEditor=(editor)=>{
        let divEditor = this.refs.textarea;
        divEditor.onclick = ()=>{
            editor.focus();                        
        }
    }
}
export {UPPEditor}