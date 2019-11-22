import React from 'react';
import Loadable from 'react-loadable';

const Loading = () => { return <div>...加载中</div> }
const AdminLogin = Loadable({ loader: () => import('../../containers/login/adminLoginContainer'), loading: Loading });

// DSUB 基础信息
const basicInformationManagement = Loadable({ loader: () => import('../../containers/pages/examRoomManagement/index'), loading: Loading });
const basicInformationManagementAdd = Loadable({ loader: () => import('../../containers/pages/examRoomManagement/add'), loading: Loading });
const basicInformationManagementView = Loadable({ loader: () => import('../../containers/pages/examRoomManagement/view'), loading: Loading });
// DSUB 项目团队
const projectTeamManagement = Loadable({ loader: () => import('../../containers/pages/examManagement/index'), loading: Loading });
const projectTeamManagementAdd = Loadable({ loader: () => import('../../containers/pages/examManagement/add'), loading: Loading });
const projectTeamManagementView = Loadable({ loader: () => import('../../containers/pages/examManagement/view'), loading: Loading });

// 项目订单
const projectOrderManagement = Loadable({ loader: () => import('../../containers/pages/projectOrderManagement/index'), loading: Loading });
const projectOrderManagementView = Loadable({ loader: () => import('../../containers/pages/projectOrderManagement/view'), loading: Loading });

export const unloginSharingPathConfig = [
    { path: '/login', component: AdminLogin },
]
export const loginedSharingPathConfig = [
    // 供给员工
    { path: '/basicInformationManagement/add', component: basicInformationManagementAdd },//添加基础信息
    { path: '/basicInformationManagement/edit/:id', component: basicInformationManagementAdd },//编辑基础信息
    { path: '/basicInformationManagement/view/:id', component: basicInformationManagementView },//详情基础信息
    { path: '/basicInformationManagement', component: basicInformationManagement },//基础信息列表

    { path: '/projectTeamManagement/add', component: projectTeamManagementAdd },//添加项目团队
    { path: '/projectTeamManagement/edit/:id', component: projectTeamManagementAdd },//编辑项目团队
    { path: '/projectTeamManagement/view/:id', component: projectTeamManagementView },//详情项目团队
    { path: '/projectTeamManagement', component: projectTeamManagement },//项目团队列表

    { path: '/projectOrderManagement/view/:id', component: projectOrderManagementView },//项目订单详情
    { path: '/projectOrderManagement', component: projectOrderManagement },//项目团队列表
]

export const careerMenusConfig = [];