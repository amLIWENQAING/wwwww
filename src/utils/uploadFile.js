import axios from 'axios';
import globalConfig from  '../config/config';

const UploadFile = {
    // send : ( url, file )=>{
    //     var formData = new FormData();
    //     formData.append("image", file );
    //     return axios.post( url , formData , {
    //         headers: {'Content-Type': 'multipart/form-data'}
    //     });
    // }

    send : ( url, param )=>{
        const serverURL = url;
        const xhr = new XMLHttpRequest;
        const fd = new FormData();
      
        const successFn = (response) => {
          // 假设服务端直接返回文件上传后的地址
          // 上传成功后调用param.success并传入上传后的文件地址
          let result = JSON.parse( xhr.responseText );
          param.success(
            {
                url: globalConfig.examApiUrl+ "upload/" + result.result,
                meta: {
                    id: 'xxx',
                    title: 'xxx',
                    alt: 'xxx',
                    loop: true, // 指定音视频是否循环播放
                    autoPlay: true, // 指定音视频是否自动播放
                    controls: true, // 指定音视频是否显示控制栏
                    poster: 'http://xxx/xx.png', // 指定视频播放器的封面
                }
            })
        }
      
        const progressFn = (event) => {
          // 上传进度发生变化时调用param.progress
          param.progress(event.loaded / event.total * 100)
        }
      
        const errorFn = (response) => {
          // 上传发生错误时调用param.error
          param.error({
            msg: 'unable to upload.'
          })
        }
      
        xhr.upload.addEventListener("progress", progressFn, false)
        xhr.addEventListener("load", successFn, false)
        xhr.addEventListener("error", errorFn, false)
        xhr.addEventListener("abort", errorFn, false)
      
        fd.append('file', param.file)
        xhr.open('POST', serverURL, true)
        xhr.send(fd)
    }
}

export default UploadFile;