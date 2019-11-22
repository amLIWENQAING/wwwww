/**
 * Created by admin on 2018/7/24.
 */
import globalConfig from '../../config/config';

const imgUrlUtils = {

    getImgAllUrl: (url) => {
        url = globalConfig.courseUploadUrl + url;
        return url;
    }
};
export {imgUrlUtils}