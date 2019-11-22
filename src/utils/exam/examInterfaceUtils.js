/**
 * Created by admin on 2018/7/24.
 */
import cookie from '../cookie';

// let storage = window.localStorage.getItem("userInfo");
const examInterfaceUtils = {
        // getExamInterface: () => {
        //     let storage = window.localStorage;
        //     let examInterface = {
        //         levelOneOrgId: storage.channelId,
        //         levelTwoOrgId: storage.organizationId,
        //         levelThreeOrgId: storage.tenantID,
        //         userId: cookie.getCookie('userId'),
        //         userType: cookie.getCookie('userType')
        //     };
        //     return examInterface;
        // },

        userInfo: null,

        getUser: () => {
            if ( examInterfaceUtils.userInfo){
                    return examInterfaceUtils.userInfo;
            }
            else {
                let storage = window.localStorage.getItem("courseUserInfo");
                return JSON.parse(storage);
            }

        } ,

        setFiveFields:
            (obj) => {
                // examInterfaceUtils.setTestFiveSide();

                // let storage = window.localStorage.getItem("userInfo");
                // obj.fLevelOneOrgId = JSON.parse(storage).flevelOneOrgId;
                // obj.fLevelOneOrgName = JSON.parse(storage).flevelOneOrgName;
                // obj.fLevelTwoOrgId = JSON.parse(storage).flevelTwoOrgId;
                // obj.fLevelTwoOrgName = JSON.parse(storage).flevelTwoOrgName;
                // obj.fLevelThreeOrgId = JSON.parse(storage).flevelThreeOrgId;
                // obj.fLevelThreeOrgName = JSON.parse(storage).flevelThreeOrgName;
                // obj.fLevelThreeOrgTenantId = JSON.parse(storage).flevelThreeOrgTenantId;
                // obj.fLevelThreeOrgTenantName = JSON.parse(storage).flevelThreeOrgTenantName;
                // obj.fLevelThreeOrgTenantType = JSON.parse(storage).flevelThreeOrgTenantType;
                // obj.fUserType = JSON.parse(storage).fuserType;
                // obj.fTenantId = JSON.parse(storage).ftenantId;
                // obj.fTenantName = JSON.parse(storage).ftenantName;
                // obj.fTenantType = JSON.parse(storage).ftenantType;
                // obj.fUserId = JSON.parse(storage).userId;
                // obj.fUserName = JSON.parse(storage).userName;
                // obj.fUserRealName = JSON.parse(storage).realName;
                // return obj;


                obj.fLevelOneOrgId = examInterfaceUtils.userInfo.flevelOneOrgId;
                obj.fLevelOneOrgName = examInterfaceUtils.userInfo.flevelOneOrgName;
                obj.fLevelTwoOrgId = examInterfaceUtils.userInfo.flevelTwoOrgId;
                obj.fLevelTwoOrgName = examInterfaceUtils.userInfo.flevelTwoOrgName;
                obj.fLevelThreeOrgId = examInterfaceUtils.userInfo.flevelThreeOrgId;
                obj.fLevelThreeOrgName = examInterfaceUtils.userInfo.flevelThreeOrgName;
                obj.fLevelThreeOrgTenantId = examInterfaceUtils.userInfo.flevelThreeOrgTenantId;
                obj.fLevelThreeOrgTenantName = examInterfaceUtils.userInfo.flevelThreeOrgTenantName;
                obj.fLevelThreeOrgTenantType = examInterfaceUtils.userInfo.flevelThreeOrgTenantType;
                obj.fUserType = examInterfaceUtils.userInfo.fuserType;
                obj.fTenantId = examInterfaceUtils.userInfo.ftenantId;
                obj.fTenantName = examInterfaceUtils.userInfo.ftenantName;
                obj.fTenantType = examInterfaceUtils.userInfo.ftenantType;
                obj.fUserId = examInterfaceUtils.userInfo.userId;
                obj.fUserName = examInterfaceUtils.userInfo.userName;
                obj.fUserRealName = examInterfaceUtils.userInfo.realName;
                return obj;

            },

        getExamInterface:
            (oldExamInterface) => {
                if (!oldExamInterface) {
                    oldExamInterface = {};
                }
                let storage = window.localStorage.getItem("courseUserInfo");
                oldExamInterface.levelOneOrgId = JSON.parse(storage).channelId;
                oldExamInterface.levelTwoOrgId = JSON.parse(storage).organizationId;
                oldExamInterface.levelThreeOrgId = JSON.parse(storage).tenantID;
                oldExamInterface.userId = JSON.parse(storage).uId;
                oldExamInterface.userName = JSON.parse(storage).userName;
                oldExamInterface.fUserRealName = JSON.parse(storage).realName;
                oldExamInterface.userType = JSON.parse(storage).userType;
                return oldExamInterface;
            }
    }
;
export {examInterfaceUtils}