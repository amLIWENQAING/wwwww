import forbidImg from './images/403.svg';
import notFindImg from './images/404.svg';
import badImg from './images/500.svg';

const config = {
    403: {
      img: forbidImg,
      title: '403',
      desc: '抱歉，你无权访问该页面',
    },
    404: {
      img: notFindImg,
      title: '404',
      desc: '抱歉，你访问的页面不存在',
    },
    500: {
      img: badImg,
      title: '500',
      desc: '抱歉，服务器出错了',
    },
    dev: {
      img: badImg,
      title: '开发中……',
      desc: '抱歉，程序员正在加班',
    },
  };
  
  export default config;
  