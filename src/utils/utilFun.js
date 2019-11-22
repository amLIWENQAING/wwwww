import { assign } from 'lodash';
import { message } from 'antd';
import { commonService } from '../services/commonService'
import cookie from './cookie';
import { ajaxFn } from './uppAxios';
import { getCurrentMenu, getCurrentUserparties, getCourseUserInfo, getAccountInfo, accountService, getAllSiteInfo } from '../services/career/loginService';
import { eventConfig } from '../config/gloableEventConfig';
import { GlobalEventer } from './EventDispatcher';
import { DICT_FIXED } from './city';
import { JobCategory } from '../../src/utils/jobCategory';
import { map } from 'lodash';

const JobCategoryDict = JobCategory;
const dict = DICT_FIXED;

/**
 * 翻页和查询
 * @param {当前组件的this} current 
 * @param {当前页} pageNum 
 * @param {每页个数 } curPageSize 
 * @param {查询方法} searchFun 
 * @param {搜索条件（点击搜索带入的搜索条件）} search 
 */
const utilGetpage = (current, pageNum, curPageSize, searchFun, search) => {
    console.log(current, pageNum, curPageSize)
    current.setState(state => {
        state.tableInfo.loading = true;
        state.tableInfo.curPageNum = pageNum + 1;
        state.tableInfo.curPageSize = curPageSize;
        return state;
    });
    let data = {
        skipCount: pageNum * curPageSize,
        maxResultCount: curPageSize,
    };

    if (current.state.tableInfo.searchText) {
        data = assign({}, current.state.tableInfo.searchText, data);
    } else if (search) {
        data = assign({}, data, search);
    }
    searchFun(data)
        .then(r => {
            current.setState(state => {
                state.tableInfo.data = r.result;
                state.tableInfo.loading = false;
                return state;
            });
        })
        .catch(error => {
            console.log(error);
            message.error('获取数据失败');
        });
}

/**
 * 通过二级域名拼装访问地址
 * @param {*二级域名} domain 
 */
const setSiteServer = (domain) => {
    // return "http://" + domain + ".careerlink.com";
    //return globalConfig.siteServer + '/' + domain;
}

/**
 * 按用户类型获取与siteServer关联的类型
 * @param {*用户类型} userType 
 */
const userTypeBySiteServer = (userType) => {
    const data = {
        channelAdmin: 1,
        orgAdmin: 2,
        hospitalAdmin: 3
    }
    return data[userType]
}

/**
 * 查找siteId,设置当前state值
 * @param {*} selfState 
 */
const setStateSiteId = (selfState) => {
    commonService.getAllSiteInfo()
        .then(r => {
            selfState.setState({ siteId: r.result.siteId, hostPortUrl: r.result.hostPortUrl });
        })
        .catch(error => {
            message.error('获得数据失败');
        });
}


/**
 * 保存密码公共方法
 * @param {*} vals 
 * @param {*} success 
 * @param {*} fail 
 */
const savePassWord = (vals, success, fail) => {
    commonService.updateAccountPassword(vals).then(r => {
        if (r.success) {
            if (r.result.isSuccess) {
                success && success();
                message.success('操作成功');
            } else {
                fail && fail();
                message.error(r.result.msg);
            }
        } else {
            fail && fail();
            message.error('操作失败');
        }
    }).catch(error => {
        console.log(error)
        fail && fail();
        message.error('提交异常');
    });
}

const savePhone = (vals, success, fail) => {
    commonService.updateAccountPhone(vals).then(r => {
        if (r.success) {
            if (r.result.isSuccess) {
                message.success('修改成功');
                success && success();
            } else {
                fail && fail();
                message.error(r.result.msg);
            }
        } else {
            fail && fail();
            message.error('操作失败');
        }
    }).catch(error => {
        console.log(error)
        message.error('提交异常');
    })
}


/**
 * 搜索时间 开始结束日期添加从0点到23点59分59秒
 * @param {*} startDate 
 * @param {*} endDate 
 */
const setSearchTime = (creationTime, selfTime = false) => {
    let startTime, endTime;
    if (selfTime) {
        startTime = creationTime[0].format('YYYY-MM-DD HH:mm:ss');
        endTime = creationTime[1].format('YYYY-MM-DD HH:mm:ss');
    } else {
        startTime = creationTime[0].format('YYYY-MM-DD') + 'T00:00:00';
        endTime = creationTime[1].format('YYYY-MM-DD') + 'T23:59:59';
    }

    let searchTime = {};
    searchTime.startTime = startTime;
    searchTime.endTime = endTime;
    return searchTime;
}

/**
 * 设置用户登录的权限到内存中
 * @param {*} menu 
 */
const setJurisdiction = (menu) => {
    let menuData = {};
    for (let i = 0; i < menu.length; i++) {
        let one = menu[i]
        if (one.items && one.items.length > 0) {
            let oneItems = one.items;
            for (let ii = 0; ii < oneItems.length; ii++) {
                if (oneItems[ii].customData && oneItems[ii].customData.length > 0) {
                    let customData = oneItems[ii].customData;
                    for (let iii = 0; iii < customData.length; iii++) {
                        if (customData[iii].path) {
                            menuData[customData[iii].path] = customData[iii].path
                        }
                    }
                }
            }
        }
    }
    window.localStorage.setItem('menus', JSON.stringify(menuData))
}
const accountServiceError = (error) => {
    if (error && error.error && error.error.message) {
        message.error(error.error.message);
    }
    else {
        message.error('该用户名不存在');
    }
    cookie.removeCookie('refresh_token');
    cookie.removeCookie('token');
    this.setState(state => { state.loading = false; return state; });
}
/**
 * 获得用户 menu
 */
const getMenu = async (hasUserCurrent, callBack, changeRole = false, selectedRole, GetCanChangeParty, key) => {
    try {
        if (!hasUserCurrent) {
            let getCurrentLoginInformation = await getCurrentUserparties();  // 五侧 管理端 使用
            if (getCurrentLoginInformation.success && getCurrentLoginInformation.result) {
                getCurrentLoginInformation.result.uppAccount.name = getCurrentLoginInformation.result.parties[0].tenantUserName;
                GlobalEventer.eventer.dispatchAll(eventConfig.GetCurrentUserPaties_Success, getCurrentLoginInformation.result);

                let getCourseUserInfoResult = await getCourseUserInfo({ userId: getCurrentLoginInformation.result.parties[0].tenantUserID });
                GlobalEventer.eventer.dispatchAll(eventConfig.GetCouseUserInfo_Success, getCourseUserInfoResult.result.data);
            }
            if (getCurrentLoginInformation.result.uppAccount.userName !== 'Administrator') {
                GlobalEventer.eventer.dispatchAll(eventConfig.GetCurrentUserSiteInfo_Success, '');
                getAllSiteInfo()
                    .then(r => {
                        if (r.result.siteId) {
                            var data = {};
                            data.siteId = r.result.siteId;
                            data.hostPortUrl = r.result.hostPortUrl;//域名到端口
                            data.siteServerUrl = r.result.siteServerUrl;//绑定的完整站点
                            data.showWebUrl = r.result.showWebUrl;
                            GlobalEventer.eventer.dispatchAll(eventConfig.GetCurrentUserSiteInfo_Success, data);
                        }
                    })
                    .catch(error => {
                    });
            }
        }
        /////////// 切换身份    
        if (changeRole) {

            // 获取token之后的回调
            let loginSuccess = () => {
                try {
                    getMenu(true, callBack)
                    // 管理员无Site
                    if (GetCanChangeParty.result.uppAccount.userName !== 'Administrator') {
                        GlobalEventer.eventer.dispatchAll(eventConfig.GetCurrentUserSiteInfo_Success, '');
                        getAllSiteInfo()
                            .then(r => {
                                if (r.result.siteId) {
                                    var data = {};
                                    data.siteId = r.result.siteId;
                                    data.hostPortUrl = r.result.hostPortUrl;//域名到端口
                                    data.siteServerUrl = r.result.siteServerUrl;//绑定的完整站点
                                    data.showWebUrl = r.result.showWebUrl;
                                    GlobalEventer.eventer.dispatchAll(eventConfig.GetCurrentUserSiteInfo_Success, data);
                                }
                            })
                            .catch(error => {
                            });
                    }
                }
                catch (error) {
                    console.log(error);
                }
            }
            let accountInfo = {};
            let loginInfo = {
                "username": '',
                "password": '',
                "grant_type": "password",
                "client_id": "app",
                "client_secret": "app"
            };
            // for (let i = 0; i < r.result.parties.length; i++) {
            // 根据parties 信息,  获得当前登录人  的 身份 信息
            let accountInfoData = getAccountInfo(selectedRole);
            accountInfo = assign({}, accountInfo, accountInfoData);
            // }
            if (accountInfo.tenant) {
                accountService(
                    loginInfo, accountInfo.tenant,
                    accountInfo.delegation,
                    accountInfo.PUserId,
                    accountInfo.PTenantId,
                    loginSuccess,
                    accountServiceError);
            } else {
                accountServiceError({ error: { message: '该用户名不存在' } });
            }
            GetCanChangeParty.result.uppAccount.name = selectedRole.tenantUserName;
            GetCanChangeParty.result.parties[0] = GetCanChangeParty.result.parties[key];
            GlobalEventer.eventer.dispatchAll(eventConfig.GetCurrentUserPaties_Success, GetCanChangeParty.result);

            let getCourseUserInfoResult = await getCourseUserInfo({ userId: selectedRole.tenantUserID });
            GlobalEventer.eventer.dispatchAll(eventConfig.GetCouseUserInfo_Success, getCourseUserInfoResult.result.data);
            return;
        }



        // let menuResult = await getCurrentMenu();
        let menuResult = {
            "result": [{
                "name": "MainMenu",
                "displayName": "主菜单",
                "customData": {
                    "logo": "commissioner.png",
                    "footer": "",
                    "isSystemLogo": true
                },
                "items": [{
                    "name": "Workbench",
                    "icon": "desktop",
                    "displayName": "工作",
                    "order": 0,
                    "url": null,
                    "customData": null,
                    "target": null,
                    "isEnabled": true,
                    "isVisible": true,
                    "items": [{
                        "name": "work",
                        "icon": "desktop",
                        "displayName": "工作台",
                        "order": 0,
                        "url": null,
                        "customData": null,
                        "target": null,
                        "isEnabled": true,
                        "isVisible": true,
                        "items": [{
                            "name": "MyWorks",
                            "icon": null,
                            "displayName": "我的工作",
                            "order": 0,
                            "url": null,
                            "customData": [{
                                "path": "/myJob",
                                "component": null
                            }],
                            "target": null,
                            "isEnabled": true,
                            "isVisible": true,
                            "items": []
                        }]
                    }, {
                        "name": "MessageCenter",
                        "icon": "notification",
                        "displayName": "消息中心",
                        "order": 0,
                        "url": null,
                        "customData": null,
                        "target": null,
                        "isEnabled": true,
                        "isVisible": true,
                        "items": [{
                            "name": "myMessage",
                            "icon": null,
                            "displayName": "我的消息",
                            "order": 0,
                            "url": null,
                            "customData": [{
                                "path": "/noticeManagement",
                                "component": null
                            }],
                            "target": null,
                            "isEnabled": true,
                            "isVisible": true,
                            "items": []
                        }]
                    }, {
                        "name": "userSetting",
                        "icon": "schedule",
                        "displayName": "个人设置",
                        "order": 0,
                        "url": null,
                        "customData": null,
                        "target": null,
                        "isEnabled": true,
                        "isVisible": true,
                        "items": [{
                            "name": "accountSafe",
                            "icon": null,
                            "displayName": "账号安全",
                            "order": 0,
                            "url": null,
                            "customData": [{
                                "path": "/personDataView",
                                "component": null
                            }],
                            "target": null,
                            "isEnabled": true,
                            "isVisible": true,
                            "items": []
                        }]
                    }]
                }, {
                    "name": "share",
                    "icon": "share-alt",
                    "displayName": "共享",
                    "order": 0,
                    "url": null,
                    "customData": null,
                    "target": null,
                    "isEnabled": true,
                    "isVisible": true,
                    "items": [{
                        "name": "shareProjectManagement",
                        "icon": "share-alt",
                        "displayName": "考试管理",
                        "order": 0,
                        "url": null,
                        "customData": null,
                        "target": null,
                        "isEnabled": true,
                        "isVisible": true,
                        "items": [{
                            "name": "basicInformation",
                            "icon": null,
                            "displayName": "考场管理",
                            "order": 0,
                            "url": null,
                            "customData": [{
                                "path": "/basicInformationManagement",
                                "component": null
                            }],
                            "target": null,
                            "isEnabled": true,
                            "isVisible": true,
                            "items": []
                        }, {
                            "name": "projectTeam",
                            "icon": null,
                            "displayName": "考试管理",
                            "order": 0,
                            "url": null,
                            "customData": [{
                                "path": "/projectTeamManagement",
                                "component": null
                            }],
                            "target": null,
                            "isEnabled": true,
                            "isVisible": true,
                            "items": []
                            },
                            // {
                            // "name": "projectDescription",
                            // "icon": null,
                            // "displayName": "实验管理",
                            // "order": 0,
                            // "url": null,
                            // "customData": [{
                            //     "path": "/projectOrderManagement",
                            //     "component": null
                            // }],
                            // "target": null,
                            // "isEnabled": true,
                            // "isVisible": true,
                            // "items": []
                            // }
                        ]
                    }]
                }]
            }],
            "targetUrl": null,
            "success": true,
            "error": null,
            "unAuthorizedRequest": false,
            "__abp": true
        }
        console.log(5555, menuResult)
        // let umenuResult = await getUserToolMenus();
        let getUMenu = (menuItem) => {
            let temp = {
                title: menuItem.displayName,
                icon: menuItem.icon,
            }

            if (menuItem.customData && menuItem.customData.length > 0) {
                if (menuItem.customData[0].path) {
                    temp.path = menuItem.customData[0].path;
                }
            }
            else if (!menuItem.items || menuItem.items.length == 0) {
                temp.path = "/Exception";
            }

            if (menuItem.items && menuItem.items.length > 0) {
                temp.children = [];
                map(menuItem.items, x => {
                    temp.children.push(getUMenu(x))
                })
            }
            return temp;
        }

        let menuData = {};
        let tempMenu = [];
        if (menuResult.result[0] && menuResult.result[0].customData) {
            menuData.logo = menuResult.result[0].customData;
        }
        if (menuResult.result[0].items && menuResult.result[0].items.length > 0) {

            map(menuResult.result[0].items, (x, index) => {
                let b = getUMenu(x);
                b.children = b.children || [];
                tempMenu.push(b);
            })
        }
        console.log(6666, tempMenu);
        if (tempMenu.length < 1) {
            tempMenu.push({
                title: "占无菜单",
                icon: '',
                children: [
                    {
                        title: "占无菜单",
                        icon: '',
                        path: '/Exception'
                    }
                ]
            })
        }

        menuData.tempMenu = tempMenu;
        GlobalEventer.eventer.dispatchAll(eventConfig.GetUserMenu_Success, menuData);
        if (tempMenu.length > 0 && tempMenu[0].children.length > 0) {
            callBack && callBack(tempMenu[0].children[0].children[0].path)
        }

    } catch (error) {
        console.log(error);
        window.location.href = "/login"
        message.error('获取数据失败');
    }
}

// 获取地址三级目录
const getAreaById = (id) => {
    let arr = [];
    if (id) {
        dict.map((item) => {
            let province = item.children;
            province.map((item1) => {
                let city = item1.children;
                if (city && city.length) {
                    city.map((item2) => {
                        if (item2.id == id) {
                            arr.push(item.value, item1.value, item2.value);
                        }
                    })
                } else if (item1.id == id) {
                    arr.push(item.value, item1.value);
                }
            })
        });
    };
    return arr;
};
// 行业类型  迭代获取全部ID(因为不一定只有三级只好用迭代来实现) 文字
const getJoCategoryStrById = (sonId) => {
    let arrRes = [];
    let arrResName = [];
    if (JobCategoryDict.length == 0) {
        if (!!sonId) {
            arrRes.unshift(JobCategoryDict)
        }
        return arrRes;
    }
    let rev = (data, nodeId) => {
        for (let i = 0, length = data.length; i < length; i++) {
            let node = data[i];
            if (node.value == nodeId) {
                arrRes.unshift(node.value);
                arrResName.unshift(node.label);
                rev(JobCategoryDict, node.parentId);
                break;
            } else {
                if (!!node.children) {
                    rev(node.children, nodeId);
                }
            }
        }
        return arrRes;
    };
    arrRes = rev(JobCategoryDict, sonId);
    return { ids: arrRes, names: arrResName };
}


const getTypeById = (sonId, dict) => {
    let arrRes = [];
    let arrResName = [];
    if (dict.length == 0) {
        if (!!sonId) {
            arrRes.unshift(dict)
        }
        return arrRes;
    }
    let rev = (data, nodeId) => {
        for (let i = 0, length = data.length; i < length; i++) {
            let node = data[i];
            if (node.value == nodeId) {
                arrRes.unshift(node.value);
                arrResName.unshift(node.label);
                rev(dict, node.parentId);
                break;
            } else {
                if (!!node.children) {
                    rev(node.children, nodeId);
                }
            }
        }
        return arrRes;
    };
    arrRes = rev(dict, sonId);
    return arrRes;
}
export {
    utilGetpage,
    setSiteServer,
    userTypeBySiteServer,
    setStateSiteId,
    // setStateSiteDomain,
    savePassWord,
    savePhone,
    setSearchTime,
    setJurisdiction,
    getMenu,
    getAreaById,
    getJoCategoryStrById,
    getTypeById
}