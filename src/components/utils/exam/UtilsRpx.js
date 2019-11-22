/**
 * Created by admin on 2018/9/14.
 */
const UtilsRpx = {
    rpx : (num) => {
        // let w  = Math.ceil(window.innerWidth/750) * num;
        let w = (window.innerWidth / 750).toFixed(2) * num;
        return w + 'px';
    }
};
export {UtilsRpx};
