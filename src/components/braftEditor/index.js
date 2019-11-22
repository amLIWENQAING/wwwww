import React from 'react';
import BraftEditor from 'braft-editor';
import Table from 'braft-extensions/dist/table'
import { Icon, Upload } from 'antd';
import { ContentUtils } from 'braft-utils'
import globalConfig from './../../config/config';

import 'braft-editor/dist/index.css';
import 'braft-extensions/dist/table.css'
const options = {
    defaultColumns: 3, // 默认列数
    defaultRows: 3, // 默认行数
    withDropdown: false, // 插入表格前是否弹出下拉菜单
    exportAttrString: '', // 指定输出HTML时附加到table标签上的属性字符串
    // includeEditors: ['editor-id-1'], // 指定该模块对哪些BraftEditor生效，不传此属性则对所有BraftEditor有效
    // excludeEditors: ['editor-id-2']  // 指定该模块对哪些BraftEditor无效
  }
  
  BraftEditor.use(Table(options))
  
export default class EditorDemo extends React.Component {

    state = {
        editorState: null,
    }

    static getDerivedStateFromProps(props, state) {
        // 组件每次被rerender的时候，包括在组件构建之后(虚拟dom之后，实际dom挂载之前)，每次获取新的props或state之后;
        // 每次接收新的props之后都会返回一个对象作为新的state，返回null则说明不需要更新state
        let nextProps = BraftEditor.createEditorState(props.value);
        if (nextProps !== state.editorState) {
            return {
                editorState:nextProps
            }
        }
        return null
    }

    // 内容改变的回调。调用FORM的onChange
    handleEditorChange = (editorState) => {
        const { onChange } = this.props;
        if (onChange) onChange(editorState);
        this.setState({ editorState })
    }
    
    // 上传成功之后的回调
    uploadHandler = (param) => {
        let url = param.file.response && param.file.response.result.url;
        if (!url) {
            return false
        }
        let editorState = ContentUtils.insertMedias(this.state.editorState, [{
            type: 'IMAGE',
            url: globalConfig.ApiUrl + url
        }])
        this.handleEditorChange(editorState)
    }

    handleBlur=(e)=>{
        if(this.props.onBlur){
            this.props.onBlur(e);
        }
    }

    render() {
        const extendControls = [
            'separator',
            {
                key: 'antd-uploader',
                type: 'component',
                component: (
                    <Upload
                        accept="image/*"
                        showUploadList={false}
                        action={`${globalConfig.ApiUrl}/api/services/app/upload/UploadImage`}
                        onChange={this.uploadHandler}
                    >
                        {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
                        <button type="button" className="control-item button upload-button" data-title="插入图片">
                            <Icon type="picture" theme="filled" />
                        </button>
                    </Upload>
                )
            }
        ]
        const { editorState } = this.state

        return (
            <div className="my-component" style={{border:'1px solid #d9d9d9',borderRadius:'5px'}}>
                <BraftEditor
                    value={editorState}
                    onChange={this.handleEditorChange}
                    extendControls={extendControls}
                    excludeControls={'media,emoji'}
                    stripPastedStyles={true}
                    contentStyle={{height: this.props.height || 200}}
                    onBlur= {this.handleBlur}
                />
                <span style={{color:'#bbb',fontSize:'12px'}}>{this.props.notice}</span>
            </div>
        )

    }

}