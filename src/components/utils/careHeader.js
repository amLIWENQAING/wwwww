import React from 'react';

import '../../content/css/adminLogin/main.css';
import img_logo from '../../content/img/logo.png';
import img_logo1 from '../../content/img/logo1.png';

class CareHeader extends React.Component  {
    constructor(props){
        super(props);
        let tempUrl = '';
        if (!window.location.origin) {
            let url = window.location.protocol + "//" + window.location.host
            tempUrl = url.split(':');//window.location.hostname + (window.location.port ? ':' + window.location.port: '');
        } else {
            tempUrl = window.location.origin.split(':');
        }
        //console.log(window.location)
        if(tempUrl.length >0){
            this.homeUrl = tempUrl[0]+':'+tempUrl[1];
        }
        else{
            this.homeUrl = '/'
        }
        
        
    }
    render(){
        return (
            <div className='div-first'>
                <div className='div-center'>
                    <a title='开尔医疗远程云平台' href={this.homeUrl} ><img src={this.props.type&& this.props.type == 1?img_logo1:img_logo}/></a>
                    <span className='span-welcom'>{this.props.title||'开尔医疗远程云平台'}</span>

                    {this.props.content.length  >0 &&
                        <div className='div-vertical'>&nbsp;</div>                        
                    }
                    
                    <span className='span-welcom'>{this.props.content}</span>
                    {this.props.children && this.props.children}
                </div>
            </div>
        );   
    }             
}

export {CareHeader};