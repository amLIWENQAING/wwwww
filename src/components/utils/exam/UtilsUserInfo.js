/**
 * Created by admin on 2019/2/13.
 */
const UtilsUserInfo = {

    setUserInfo : (obj,userInfo) => {
        obj.flevelOneOrgId = userInfo.flevelOneOrgId;
        obj.flevelOneOrgName = userInfo.flevelOneOrgName;
        obj.flevelThreeOrgId = userInfo.flevelThreeOrgId;
        obj.flevelThreeOrgName = userInfo.flevelThreeOrgName;
        obj.flevelThreeOrgTenantId = userInfo.flevelThreeOrgTenantId;
        obj.flevelThreeOrgTenantName = userInfo.flevelThreeOrgTenantName;
        obj.flevelThreeOrgTenantType = userInfo.flevelThreeOrgTenantType;
        obj.flevelTwoOrgId = userInfo.flevelTwoOrgId;
        obj.flevelTwoOrgName = userInfo.flevelTwoOrgName;
        obj.ftenantId = userInfo.ftenantId;
        obj.ftenantName = userInfo.ftenantName;
        obj.ftenantType = userInfo.ftenantType;
        obj.fuserType = userInfo.fuserType;
        obj.userId = userInfo.userId;
        obj.userName = userInfo.userName;
        return obj;
    }
};
export {UtilsUserInfo};