import React, { Component } from 'react';
import { Upload, message, Button, Modal, Icon } from 'antd';
import globalConfig from './../../config/config';
//import '../../content/css/viewPic/viewPic.css';

import * as utils from '../../utils/index';


// const UPPUpload = (fileInfo) => {
//     const props = {
//         name: 'file',
//         action: globalConfig.ApiUrl + "/api/services/app/upload/UploadImage",
//         headers: {
//             authorization: 'authorization-text'
//         },
//         listType: fileInfo.type,
//         onChange(info) {
//             if (info.file.status !== 'uploading') {
//                 console.log(info.file, info.fileList);
//             }
//             if (info.file.status === 'done') {
//                 message.success(`${info.file.name} file uploaded successfully`);
//             } else if (info.file.status === 'error') {
//                 message.error(`${info.file.name} file upload failed.`);
//             }
//         }
//     };
//     return (
//         <Upload {...props}>
//             <Button>
//                 <Icon type="upload"/>
//                 {fileInfo.title}
//             </Button>
//         </Upload>
//     )
// }

const fileList11 = [{
    uid: -1,
    name: 'xxx.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
}, {
    uid: -2,
    name: 'yyy.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
}];

class UPPUpload extends Component {
    constructor(props) {
        super(props);

        this.state = {
            defaultinitialValue: this.props.defaultinitialValue ? this.getItemsFromProps(this.props.defaultinitialValue) : [],
        }
    }

    componentWillReceiveProps(nextProps) {
        if (utils.cmp(nextProps.defaultinitialValue, this.props.defaultinitialValue)) {
            return;
        }

        let defaultinitialValue = nextProps.defaultinitialValue;
        let tempArr = [];
        if (defaultinitialValue && defaultinitialValue.length > 0) {
            defaultinitialValue.map((item) => { //eg:initialValue:{name:xxx.png,url:"/temp/a/"}
                if (item) {
                    tempArr.push({
                        uid: item.uid,// -1,
                        name: item.name,
                        status: 'done',
                        //url: globalConfig.ApiUrl+item.url+item.name,
                        url: globalConfig.ApiUrl + item.url,
                        thumbUrl: globalConfig.ApiUrl + item.url,
                    })
                }
            });

            this.setState({ fileList: tempArr });
        };

    }

    getItemsFromProps = (propsValue) => {
        let defaultinitialValue = propsValue;
        let tempArr = [];
        if (defaultinitialValue && defaultinitialValue.length > 0) {
            defaultinitialValue.map((item) => { //eg:initialValue:{name:xxx.png,url:"/temp/a/"}
                if (item) {
                    tempArr.push({
                        uid: item.uid,// -1,
                        name: item.name,
                        status: 'done',
                        //url: globalConfig.ApiUrl+item.url+item.name,
                        url: globalConfig.ApiUrl + item.url,
                        thumbUrl: globalConfig.ApiUrl + item.url,
                    })
                }
            });
        };

        return tempArr.slice();
    }

    handleChange = ({ fileList }) => {
        this.setState({ fileList });
        if (this.props.fileType === "DICOM") {
            this.props.getDicomUrl(fileList)
        } else {
            this.props.getAttachments(fileList);
        }
    }

    render() {
        let self = this;
        const props = {
            name: 'file',
            action: globalConfig.ApiUrl + "/api/services/app/upload/UploadImage",
            headers: {
                authorization: 'authorization-text'
            },
            //listType: "picture",
            defaultFileList: this.state.defaultinitialValue,
            //fileList: self.state.fileList.slice(),
            onChange: self.handleChange,
        };
        return (
            <Upload {...props}>
                <Button>
                    <Icon type="upload" />
                    {this.props.title}
                </Button>
            </Upload>
        )
    }
}

// 照片墙  用户可以上传图片并在列表中显示缩略图。当上传照片数到达限制后，上传按钮消失。
class UPPPicturesWall extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList: [],
        };
    }

    componentWillReceiveProps(nextProps) {

        if (utils.cmp(this.props.initialValue, nextProps.initialValue)) {
            return;
        }

        const initialValue = nextProps.initialValue;
        let fileList = [];
        if (initialValue && initialValue.length > 0) {
            initialValue.map((item) => { //eg:initialValue:{name:xxx.png,url:"/temp/a/"}
                if (item) {
                    fileList.push({
                        uid: item.uid,// -1,
                        name: item.name,
                        status: 'done',
                        url: globalConfig.ApiUrl + item.url,//'/temp/'+item, 
                    })
                }
            });
        };

        this.setState({ fileList });
    }

    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    handleChange = ({ file, fileList }) => {
        this.setState({ fileList });
        this.props.getPictures(fileList);
        let photoErro = false;
        let url = []
        if ((file.status == 'done' && !file.error) || file.status == 'removed') {
            if (fileList.length > 0) {
                for (let i = 0; i < fileList.length; i++) {
                    if (fileList[i].status == "done") {
                        if (fileList[i].response && fileList[i].response.success) {
                            url.push(fileList[i].response.result.url);
                        } else {
                            url.push(fileList[i].name);
                        }
                    } else if (fileList[i].status == 'error') {
                        photoErro = true
                    }
                }
            }
            if (photoErro) {
                this.props.onChange('error');
            } else {
                this.props.onChange(url.toString());
            }
        } else if (file.status == 'error' && file.error) {
            this.props.onChange('error');
        }
    }

    beforeUpload = (file) => {
        if (this.props.beforeUpload) {
            return this.props.beforeUpload(file);
        } else {
            return true;
        }
    }

    render() {
        const info = this.props;

        const { previewVisible, previewImage, fileList } = this.state;

        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">{info.title}</div>
            </div>
        );
        let props = {
            name: 'file',
            action: globalConfig.ApiUrl + "/api/services/app/upload/UploadImage",
            headers: {
                authorization: 'authorization-text'
            },
            listType: "picture-card",
            fileList: fileList,
            onPreview: this.handlePreview,
            onChange: this.handleChange,
            beforeUpload: this.beforeUpload,
            locale: { previewFile: '预览', removeFile: '删除' }
        };
        if (info.accept) {
            props.accept = info.accept;
        }
        return (
            <div className="clearfix">
                <Upload
                    {...props}
                >
                    {fileList.length >= info.size ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}

// fileList= '/upload/uploadTemp/1.png,/upload/uploadTemp/2.png'
// fileList  = [
//    {
//        name:'1.png',
//        url:'http://192.168.1.1/upload/1.png',
//        status:'done'
//    }
//  ]
class CustomPictureWall extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            previewVisible: false,
            previewImage: '',
        };
    }

    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    handleChange = ({ file, fileList }) => {
        // if(this.props.getPictures){
        //     this.props.getPictures(fileList);
        // }     

        this.onChange(fileList);
    }

    onChange = (fileList) => {
        if (this.props.onChange) {
            this.props.onChange(fileList);
        }
    }

    beforeUpload = (file) => {
        if (this.props.beforeUpload) {
            return this.props.beforeUpload(file);
        } else {
            return true;
        }
    }

    setImgUrl = (fileList) => {
        fileList = fileList || [];
        if (fileList.constructor.name == 'String') {
            if (fileList == '') {
                fileList = []
            }
            else {
                fileList = fileList.split(',')
            }
        }
        if (!fileList || !fileList.length) {
            return fileList;
        }
        let tempArr = [];
        for (let i = 0; i < fileList.length; i++) {
            if (!fileList[i].status && !fileList[i].response) {
                let tempItem = {};
                if (fileList[i].indexOf(globalConfig.ApiUrl) == -1) {
                    tempItem.url = globalConfig.ApiUrl + fileList[i];
                }
                else {
                    tempItem.url = fileList[i];
                }
                tempItem.name = fileList[i].substring(fileList[i].lastIndexOf('/') + 1);
                tempItem.uid = tempItem.name;
                tempItem.status = 'done';
                tempArr.push(tempItem)
            }
            else {
                tempArr.push(fileList[i]);
            }
        }
        return tempArr;
    }

    render() {
        let self = this;
        const info = this.props;

        const { previewVisible, previewImage } = this.state;

        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">{info.title}</div>
            </div>
        );
        let props = {
            name: 'file',
            action: globalConfig.ApiUrl + "/api/services/app/upload/UploadImage",
            headers: {
                authorization: 'authorization-text'
            },
            listType: "picture-card",
            fileList: self.setImgUrl(self.props.fileList),
            //defaultFileList: self.setImgUrl( self.props.defaultFileList ),
            onPreview: self.handlePreview,
            onChange: self.handleChange,
            beforeUpload: self.beforeUpload,
            locale: { previewFile: '预览', removeFile: '删除' }
        };
        if (info.accept) {
            // upload 支持上传的类型
            props.accept = info.accept;
        }
        return (
            <div className="clearfix">
                <Upload
                    {...props}
                >
                    {info.size && self.props.fileList && self.setImgUrl(self.props.fileList).length >= info.size ? null : uploadButton}
                </Upload>
                <span style={{color:'#bbb',fontSize:'12px'}}>{this.props.notice}</span>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}

class ViewPictureWall extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false,
            viewPicPath: '',
        }
    }

    // onTransformBtnClick = ()=>{
    //     let transformClassArr = [
    //         'img-transform-0','img-transform-90','img-transform-180','img-transform-270'
    //     ];
    //     let index = transformClassArr.indexOf(this.divTranformImg.className);
    //     let className  = transformClassArr[1];
    //     if(index >=0){
    //         className = transformClassArr[(index +1)%4];
    //     }

    //     index =  transformClassArr.indexOf(className);
    //     let height = this.divTranformImg.clientWidth - this.divTranformImg.clientHeight;    
    //     if(index%2==0){
    //         this.divTranformImg.className = className;
    //         this.divTranformImg.parentElement.style.height = (this.divTranformImg.parentElement.clientHeight - height) + 'px';
    //         //this.divTranformImg.style.position = 'block';
    //         //this.divTranformImg.style.position = 'relative';
    //         this.divTranformImg.style.top = 0 + 'px';
    //     }
    //     else{                     
    //         this.divTranformImg.parentElement.style.height = (this.divTranformImg.parentElement.clientHeight + height) + 'px';
    //         this.divTranformImg.style.position = 'relative';
    //         this.divTranformImg.style.top = height/2 + 'px';
    //         this.divTranformImg.className = className;
    //     }

    //     //this.imgModal.render();
    // } 

    // 放大   
    toBig = () => {
        let width = this.divTranformImg.clientWidth;
        if (width > 1028) {
            return;
        }
        if (!this.state.imgWidth) {
            this.setState({ imgWidth: width });
        }
        width += 100;
        this.setState({ popWidth: width + 48 }, () => {
            this.divTranformImg.style.width = width + 'px';
        });
    }
    // 缩小
    toSmall = () => {
        let width = this.divTranformImg.clientWidth;
        if (width <= this.state.imgWidth) {
            return;
        }

        width -= 100;
        this.setState({ popWidth: width + 48 }, () => {
            this.divTranformImg.style.width = width + 'px';
        });
    }

    handleCancel = () => {
        // this.divTranformImg.className = '';
        // this.divTranformImg.parentElement.style = '';
        // this.divTranformImg.style.top = 0 + 'px';
        // this.setState({visible:false}, () => {
        //     // this.divTranformImg.className = '';
        //     // this.divTranformImg.parentElement.style = '';
        //     // this.divTranformImg.style.top = 0 + 'px';
        // });

        this.setState({ visible: false });
    }

    handlePicClick = (path) => {
        // if(this.divTranformImg){
        //     this.divTranformImg.className = '';
        //     this.divTranformImg.parentElement.style = '';
        //     this.divTranformImg.style.top = 0 + 'px';
        // }
        if (this.divTranformImg) {
            let imgWidth = this.state.imgWidth;
            this.divTranformImg.style.width = imgWidth + 'px';
            this.setState({ popWidth: imgWidth, popWidth: 520, imgWidth: '' });
        }


        this.setState({
            visible: true,
            viewPicPath: path
        });
    }

    render() {
        if (!this.props.picArr) {
            return <div ></div>;
        }

        const picArr = this.props.picArr.split(',');
        const visible = this.state.visible;
        const path = this.state.viewPicPath;
        return (
            <div>
                {
                    picArr.map((x, i) => { return <img src={globalConfig.ApiUrl + x} onClick={() => { this.handlePicClick(x) }} key={i} width='80px' style={{ marginRight: '5px' }} /> })
                }
                <Modal
                    visible={visible}
                    onCancel={this.handleCancel}
                    footer=""
                    width={this.state.popWidth}
                    ref={r => this.imgModal = r}
                >
                    <div style={{ marginBottom: '2px', marginRight: '20px' }} >
                        <div style={{ textAlign: 'right' }}>
                            {/* <Button onClick={this.onTransformBtnClick}>旋转</Button> */}
                            <Button onClick={this.toBig} style={{ marginRight: '20px' }}>放大</Button>
                            {this.state.imgWidth && <Button onClick={this.toSmall}>缩小</Button>}
                        </div>
                    </div>
                    <div ref={r => this.divTranformImg = r}>
                        <img src={globalConfig.ApiUrl + path} style={{ marginRight: 50 }} width="100%" />
                    </div>
                </Modal>
            </div>
        );
    }
}

class UppDicomUplod extends Component {
    constructor(props) {
        super(props);
    }

    chooseFolder = (e) => {
        e.preventDefault();
        // CFormDicomApi.chooseFolder();
    }

    uploadDicom = (data) => {
        // CFormDicomApi.doUpload({
        //     appId: data.dicomid,
        //     organId: data.organid,
        //     patName: data.pname,
        //     patAge: data.age,
        //     patGender: data.gender,
        //     dataLocation: data.dataLocation
        // }, function() {
        //     //window.location.href = "";
        // });

    }

    render() {
        return (
            <div ref="textarea">
                <input name="dataLocation" id="dataLocation" type="hidden" value="" />
                <input type="button" value="选择目录" onClick={this.chooseFolder} />
                <div class="">
                    <label></label>
                    <ul id="dicomFileContainer"></ul>
                </div>
            </div>
        )
    }
};


// fileList=[{name:'fileName',value:'/upload/uploadTemp/1.txt'}]
class CustomUpload extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        visible: false,
        videoURL: ''
    };
    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };
    handleChange = ({ fileList }) => {

        // // 1. Limit the number of uploaded files
        // // Only to show two recent uploaded files, and old ones will be replaced by the new
        //fileList = fileList.slice(-2);

        // // 2. Read from response and show file link
        // fileList = fileList.map((file) => {
        //   if (file.response) {
        //     // Component will show file.url as link
        //     file.url = file.response.url;
        //   }
        //   return file;
        // });

        // // 3. Filter successfully uploaded files according to response from server
        // fileList = fileList.filter((file) => {
        //   if (file.response) {
        //     return file.response.status === 'success';
        //   }
        //   return true;
        // });

        // if(this.props.size){
        //     fileList  = fileList.slice( parseInt('-'+ this.props.size));
        // }

        if (this.props.getAttachments) {
            this.props.getAttachments(fileList);
        }

        this.onChange(fileList);
    }

    onChange = (fileList) => {
        if (this.props.onChange) {
            this.props.onChange(fileList);
        }
    }

    beforeUpload = (file) => {
        if (this.props.beforeUpload) {
            return this.props.beforeUpload(file);
        } else {
            return true;
        }
    }

    setFileUrl = (fileList) => {
        fileList = fileList || [];
        if (fileList.constructor.name == 'String') {
            if (fileList == '') {
                fileList = []
            }
            else {
                //fileList = fileList.split(',')
                fileList = JSON.parse(fileList);
            }
        }
        if (!fileList || !fileList.length) {
            return fileList;
        }
        let tempArr = [];
        for (let i = 0; i < fileList.length; i++) {
            if (!fileList[i].status && !fileList[i].response) {
                let tempItem = {};
                if (fileList[i].value && fileList[i].value.indexOf(globalConfig.ApiUrl) == -1) {
                    tempItem.url = globalConfig.ApiUrl + fileList[i].value;
                }
                else {
                    tempItem.url = fileList[i].value;
                }
                tempItem.name = fileList[i].name;
                tempItem.uid = tempItem.name;
                tempItem.status = 'done';
                tempArr.push(tempItem)
            }
            else {
                tempArr.push(fileList[i]);
            }
        }
        return tempArr;
    }

    render() {
        const props = {
            action: globalConfig.ApiUrl + "/api/services/app/upload/UploadImage",
            headers: {
                authorization: 'authorization-text'
            },
            onChange: this.handleChange,
            name: 'file',
            beforeUpload: this.beforeUpload,
        };
        if (this.props.accept) {
            // upload 支持上传的类型
            props.accept = this.props.accept;
        }
        if (props.accept == 'video/mp4') {
            // props.listType = 'picture';
            // props.onPreview = (e) => {
            //     this.showModal();
            //     this.setState({
            //         videoURL: e.url || ''
            //     })
            // }
            props.action = globalConfig.ApiUrl + "/api/services/app/upload/UploadVideo";

        }
        const fileList = this.setFileUrl(this.props.fileList);

        let disabled = !(this.props.size && this.props.fileList && this.props.fileList.length < this.props.size);
        return (
            <div>
                <Upload {...props} fileList={fileList}>
                    <Button disabled={disabled}>
                        <Icon type="upload" /> {this.props.title}
                    </Button>
                </Upload>
                <span style={{color:'#bbb',fontSize:'12px'}}>{this.props.notice}</span>
                {/* <Modal
                    title="视频播放"
                    width='1000px'
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <video width="100%" controls="controls" src={this.state.videoURL}>
                        该浏览器不支持此播放器。请使用谷歌浏览器播放
                    </video>
                </Modal> */}
            </div>

        );
    }
}

export { UPPUpload, UPPPicturesWall, UppDicomUplod, ViewPictureWall, CustomUpload, CustomPictureWall }