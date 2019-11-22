import React, { Component } from 'react';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from 'react-router-dom';
import { Layout, Menu, Breadcrumb, Icon, Spin, Dropdown, Button, List, Tag, message } from 'antd';
import { loginedPathConfig, unloginPathConfig, menusConfig } from './config/menuPathConfig';
import { GetCanChangeCurrentParty } from './services/career/loginService'
import { GlobalEventer } from './utils/EventDispatcher';
import { eventConfig } from './config/gloableEventConfig';
import globalConfig from './config/config';
import { UPPModal } from './components/common/index';
import { getMenu } from './utils/utilFun';
import { examInterfaceUtils } from './utils/exam/examInterfaceUtils';
import cookie from './utils/cookie';
import { map } from 'lodash';
import './App.css';
import Exception from './components/Exception/index';
import IsLogin from  './components/IsLogin/isLogin';

const { Header, Content, Footer, Sider, } = Layout;
const SubMenu = Menu.SubMenu;
export default class App extends Component {
    constructor(props) {
        super(props);

        this.unLoginRouteArr = [];

        this.loginedRouteArr = [];

        this.state = {
            collapsed: false,
            selectedKeys: [],
            defaultOpenKeys: ['0'],//打开菜单数组
            menuArr: [],
            menuData: [],
            siteId: 0,
            hostPortUrl: '',//域名到端口
            siteServerUrl: '',//绑定的完整站点
            showWebUrl: '',//
            logo: {},
            current: ['0'],
            // 左侧菜单标签数组
            submenuItem: [],
            // 左侧菜单数组
            submenuArr: [],
            modalInfo: {
                title: '入驻机构',
                text: '',
                visible: false
            },
            parties: [],
            selectedRole: {},
            GetCanChangeParty: {},
            loadingSecond: false,
            loading:false
        };

        // 用于 获得 五侧 管理端 的 用户信息
        GlobalEventer.eventer.addEventListener(eventConfig.GetCurrentUserPaties_Success, (eventName, eventData) => {
            this.router.history.CurrentUserParties = eventData;
        });

        // 用于 获得 课程 用户 的 用户信息
        GlobalEventer.eventer.addEventListener(eventConfig.GetCouseUserInfo_Success, (eventName, eventData) => {

            this.router.history.userInfo = eventData;

            examInterfaceUtils.userInfo = eventData;

            window.localStorage.setItem('courseUserInfo',JSON.stringify(eventData));
        });

        GlobalEventer.eventer.addEventListener(eventConfig.GetCurrentUserSiteInfo_Success, (eventName, eventData) => {
            this.setState({
                siteId: eventData.siteId,
                hostPortUrl: eventData.hostPortUrl,
                siteServerUrl: eventData.siteServerUrl,
                showWebUrl: eventData.showWebUrl,
            });
        });

        GlobalEventer.eventer.addEventListener(eventConfig.GhangeMenuSelectedKeys, (eventName, eventData) => {
            // let {submenuArr,menuData} = this.state;
            // console.log(88888, menuData);
            // console.log(555, this.state.submenuArr);
            // let selectedKeys = [];
            // let defaultOpenKeys = [];
            // for (let a = 0; a <= menuData.length; a++){
            //     let children1 = menuData[a].children;
            //     for (let i = 0; i < children1.length; i++) {
            //         let children = children1[i].children;
            //         for (let j = 0; j < children.length; j++) {
            //             if (children[j].path == eventData) {
            //                 selectedKeys = [this.state.current[a] + '-' + i + '-' + j];
            //                 defaultOpenKeys = [this.state.current[a] + '-' + i];
            //                 break;
            //             }
            //         }
            //         if (selectedKeys.length != 0) {
            //             break;
            //         }
            //     }
            // }

            // this.setState({
            //     selectedKeys: selectedKeys,
            //     defaultOpenKeys: defaultOpenKeys,
            // });
            let pathname = eventData;
            if (pathname !== '/' && pathname !== '/login') {
                let menuData = this.state.menuData;
                let current = [];
                let selectedKeys = [];
                let defaultOpenKeys = [];
                for (let i = 0; i < menuData.length; i++) {
                    let children = menuData[i].children;
                    for (let j = 0; j < children.length; j++) {
                        let childrenSecond = children[j].children;
                        for (let p = 0; p < childrenSecond.length; p++) {
                            if (pathname.indexOf(childrenSecond[p].path) !== -1) {
                                selectedKeys = [i + '-' + j + '-' + p];
                                defaultOpenKeys = [i + '-' + j];
                                current = [i + '']
                                break;
                            }
                        }
    
                    }
                    if (selectedKeys.length != 0) {
                        break;
                    }
                }
    
                if (current.length > 0 && selectedKeys.length > 0 && defaultOpenKeys.length > 0) {
                    this.handleClick({ key: current });
                    this.setState({
                        current,
                        selectedKeys,
                        defaultOpenKeys,
                    });
                }
    
            }
        });

        GlobalEventer.eventer.addEventListener(eventConfig.GetUserMenu_Success, (eventName, eventData) => {

            // 刷新以后的路由
            if(this.loginedRouteArr.length == 0){
                map(loginedPathConfig, x => this.renderLoginedRouter(x, '', this.loginedRouteArr));
            }

            // 登录以后的菜单
            let tempMenu = [];
            // let rootSubmenuKeys = [];

            // 退出，然后从新登录 会保留上次登录的 router 信息，所以在此删掉后重新添加
            if (loginedPathConfig.length < this.loginedRouteArr.length) {
                this.loginedRouteArr.splice(loginedPathConfig.length, this.loginedRouteArr.length - loginedPathConfig.length);
            }
            map(eventData.tempMenu, (x, index) => {
                tempMenu.push(this.renderMenu(x, index + ''));
                // rootSubmenuKeys.push(index + '')
            });
            // let logo = '/images/' + eventData.logo;

            //默认打开工作台
            this.setState({
                menuArr: tempMenu,
                // rootSubmenuKeys,
                menuData: eventData.tempMenu,
                logo: eventData.logo,
                defaultOpenKeys: ['0-0'],
                selectedKeys: ['0-0-0'],
            });

            // 初始化左侧菜单
            this.handleClick({ key: 0 });
        });

        window.addEventListener('popstate', () => {
            GlobalEventer.eventer.dispatchAll(eventConfig.GhangeMenuSelectedKeys, window.location.pathname);
        });
    }

    componentWillMount() {

        // 未登录状态的路由
        map(unloginPathConfig, x => this.renderRouter(x, '', this.unLoginRouteArr));
        // 登录以后的路由
        map(loginedPathConfig, x => this.renderLoginedRouter(x, '', this.loginedRouteArr));

        this.routeCount = this.loginedRouteArr.length;

    }

     componentDidMount(){

        // debugger;
        // let self  = this;

        // let token = cookie.getCookie('token');

        // if (self.state.menuArr.length < 1 && token) {  // 刷新

        //     self.loginedRouteArr.length = 0;

        //     let hasUserCurrent = false;
        //     if (!'router' in self || (self.router && 'CurrentUserParties' in self.router.history)) {
        //         hasUserCurrent = true;
        //     }
        //     getMenu(hasUserCurrent, (url) => {
        //         if (window.location.pathname) {
        //             url = window.location.pathname;
        //         }
        //         self.router.history.push(url);
        //         self.refreshMenu();
        //     })
        // }

    }

    //退出
    logout = () => {
        cookie.removeCookie('token');
        cookie.removeCookie('login_address');
        cookie.removeCookie('refresh_token');
        cookie.removeCookie('reportchannelId');
        window.localStorage.removeItem('courseUserInfo');
        this.router.history.CurrentUserParties = null
        this.router.history.push('/login');
    }
    // 刷新页面保持当前菜单高亮状态
    refreshMenu = () => {

        if (!this.state.menuData) {
            return;
        }

        let pathname = window.location.pathname;
        if (pathname !== '/' && pathname !== '/login') {
            let menuData = this.state.menuData;
            let current = [];
            let selectedKeys = [];
            let defaultOpenKeys = [];
            for (let i = 0; i < menuData.length; i++) {
                let children = menuData[i].children;
                for (let j = 0; j < children.length; j++) {
                    let childrenSecond = children[j].children;
                    for (let p = 0; p < childrenSecond.length; p++) {
                        if (pathname.indexOf(childrenSecond[p].path) !== -1) {
                            selectedKeys = [i + '-' + j + '-' + p];
                            defaultOpenKeys = [i + '-' + j];
                            current = [i + '']
                            break;
                        }
                    }

                }
                if (selectedKeys.length != 0) {
                    break;
                }
            }

            if (current.length > 0 && selectedKeys.length > 0 && defaultOpenKeys.length > 0) {
                this.handleClick({ key: current });
                this.setState({
                    current,
                    selectedKeys,
                    defaultOpenKeys,
                });
            }

        }
    }
    renderRouter = (configItem, parentPath, routeArr) => {
        let tempPath = parentPath || '';
        if (configItem.children && configItem.children.length > 0) {
            routeArr.push(
                <Route path={tempPath + configItem.path}>
                    {map(configItem.children, x => this.renderRouter(x, tempPath + configItem.path, routeArr))}
                </Route>
            );
        }
        else {
            routeArr.push(<Route exac path={tempPath + configItem.path} component={configItem.component} />);
        }
    }

    renderLoginedRouter = (configItem, parentPath, routeArr) =>{
        
        let token = cookie.getCookie('token');

        let loginComponent = <Redirect push to="/login" />;
        
        let component = (props)=>( <IsLogin menuArr={this.state.menuArr} refreshMenu={this.refreshMenu} ><configItem.component {...props} /></IsLogin>);

        //let component  = configItem.component ;

        let tempPath = parentPath || '';

        if (configItem.children && configItem.children.length > 0) {
            routeArr.push(
                <Route path={tempPath + configItem.path}>
                    {map(configItem.children, x => this.renderLoginedRouter(x, tempPath + configItem.path, routeArr))}
                </Route>
            );
        }
        else {
            routeArr.push(<Route exac path={tempPath + configItem.path} component={ component } />);
        }
    }

    // 面包屑
    getBreadCrumb() {
        let menuData = this.state.menuData;
        let pathname = window.location.pathname;
        let name1 = '';
        let name2 = '';
        let name3 = '';
        let name4 = '';
        for (let i = 0; i < menuData.length; i++) {
            let children = menuData[i].children;
            for (let j = 0; j < children.length; j++) {
                let secChildren = children[j].children
                for (let p = 0; p < secChildren.length; p++) {
                    if (pathname.indexOf(secChildren[p].path) !== -1) {
                        name1 = children[j].title;
                        name2 = menuData[i].title;
                        name3 = secChildren[p].title;
                        // if (pathname.indexOf('edit') !== -1) {
                        //     name4 = '编辑'
                        // };
                        // if (pathname.indexOf('add') !== -1) {
                        //     name4 = '添加'
                        // };
                        // if (pathname.indexOf('view') !== -1) {
                        //     name4 = '详情'
                        // };

                        break;
                    }
                }
                if (!!name1) {
                    break;
                }
            }
            if (!!name1) {
                break;
            }
        }
        let extraBreadcrumbItems = (<Breadcrumb.Item key={pathname}>
            {name1}
        </Breadcrumb.Item>)
        let extraBreadcrumbItemsSec = (<Breadcrumb.Item key={pathname}>
            {name3}
        </Breadcrumb.Item>)
        // let extraBreadcrumbItemsThird = (<Breadcrumb.Item key={pathname}>
        //     {name4}
        // </Breadcrumb.Item>)
        return (
            [(
                <Breadcrumb.Item key="home">
                    {name2}
                </Breadcrumb.Item>
            )].concat(extraBreadcrumbItems)
                .concat(extraBreadcrumbItemsSec)
            // .concat(extraBreadcrumbItemsThird)
        )
    }

    // 点击顶部菜单获取左侧子菜单
    handleClick = (key) => {
        let submenuItem = [], rootSubmenuKeys = [];
        map(this.state.menuData[key.key].children, (x, index) => {
            submenuItem.push(this.renderSubMenu(x, key.key + '-' + index));
            rootSubmenuKeys.push(key.key + '-' + index);
        });
        this.setState({
            current: [key.key + ''],
            submenuItem,
            submenuArr: this.state.menuData[key.key].children,
            rootSubmenuKeys,
        })
    }
    // 获取左侧菜单
    renderSubMenu = (menuItem, parentKeyPath) => {
        let self  = this;
        let tempKeyPath = parentKeyPath || '';
        // 添加工具路由
        let id = this.router.history.CurrentUserParties.uppAccount.id;

        if (menuItem.children && menuItem.children.length > 0) {
            return (
                <SubMenu key={tempKeyPath} title={<span><Icon type={menuItem.icon || ''} /><span>{menuItem.title || ''}</span></span>}>
                    {map(menuItem.children, (x, index) => this.renderSubMenu(x, tempKeyPath + '-' + index))}
                </SubMenu>
            );
        }
        else {
            return (
                <Menu.Item key={tempKeyPath} >
                    <Link to={menuItem.path}>
                        <Icon type={menuItem.icon || ''} />
                        <span>{menuItem.title || ''}</span>
                    </Link>
                </Menu.Item>
            );
        }
    }
    // 获取上部菜单
    renderMenu = (menuItem, parentKeyPath) => {

        let tempKeyPath = parentKeyPath || '';

        // 添加工具路由
        // let id = this.router.history.CurrentUserParties.uppAccount.id;

        // if (menuItem.realPath) {
        //     let tempProps = { realPath: menuItem.realPath };
        //     this.loginedRouteArr.push(<Route path={menuItem.path} component={(props) => { return <IframeContainer {...tempProps} /> }} />)
        // }
        return (
            <Menu.Item key={tempKeyPath} >
                <Icon type={menuItem.icon || ''} />
                <span>{menuItem.title || ''}</span>
            </Menu.Item>
        );
    }

    // onCollapse = (collapsed) => {
    //     console.log(collapsed);
    //     this.setState({ collapsed });
    // }
    // 点击左侧菜单
    handelSidebarMenusClick = (e) => {
        this.setState({
            defaultOpenKeys: [e.keyPath[1]],
            selectedKeys: [e.key],
        })
    }
    // 点击菜单收起其他展开的所有菜单。保持菜单聚焦整洁
    handelOpenChange = (openKeys) => {
        const latestOpenKey = openKeys.find(key => this.state.defaultOpenKeys.indexOf(key) === -1);
        if (this.state.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({
                defaultOpenKeys: openKeys,
            });
        } else {
            this.setState({
                defaultOpenKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
    }

    /**
     * 入驻机构
     */
    SettledOrganzation = () => {
        let title = '入驻机构';
        this.setState((prevState) => {
            prevState.modalInfo.visible = true;
            prevState.modalInfo.title = title;
            return prevState;
        });
    }

    /**
     * 入驻机构取消
     */
    handleCancelSubmit = () => {
        this.setState((prevState) => {
            prevState.modalInfo.visible = false;
            return prevState;
        });
    }
    goSelectRole = (data = []) => {
        this.setState((prevState) => {
            prevState.modalInfo.visible = true;
            prevState.modalInfo.title = '选择账号类型';
            prevState.parties = data;
            return prevState;
        });
    }

    // 更换角色
    changeRole = async () => {
        this.setState({
            loading:true
        }, async() => {
            let GetCanChangeParty = await GetCanChangeCurrentParty();
            if (GetCanChangeParty.success) {
                GetCanChangeParty.result.parties = GetCanChangeParty.result.parties.filter(function (o) { return o.partyIdentityCardType != 24 })
                this.setState({
                    GetCanChangeParty,
                    loading:false
                })
                if (!(GetCanChangeParty.result.parties.length == 1 && GetCanChangeParty.result.parties[0].partyList.length == 1)) {
                    this.goSelectRole(GetCanChangeParty.result.parties);
                    return;
                } else {
                    message.warning('此账号无其他角色');
                }
                // 账户类型选择
            }
        })
    }
    // 选择账号类型
    selectedRole = (selectedRole, key, index) => {
        this.setState({
            index,
            key,
            selectedRole
        })
    }
    // 选择账号类型后切换身份
    login = async () => {
        if (Object.keys(this.state.selectedRole).length == 0) {
            message.warning('请选择账号类型');
            return
        }
        getMenu(
            true,
            (url) => {
                url = '/myJob';
                this.router.history.push(url);
                this.refreshMenu()
            },
            true,
            this.state.selectedRole,
            this.state.GetCanChangeParty,
            this.state.key
        )
        this.setState((prevState) => {
            prevState.modalInfo.visible = false;
            prevState.loadingSecond = false;
            prevState.index = '';
            prevState.key = '';
            prevState.selectedRole = {};
            return prevState;
        });

    }
    renderLoginedView = (menuArr) => {

        let token = cookie.getCookie('token');
        let account = '';

        // -------------------------------- jilin update ----------------------------

        // if (menuArr.length < 1 && token) {
        //     let hasUserCurrent = false;
        //     if (!'router' in this || (this.router && 'CurrentUserParties' in this.router.history)) {
        //         hasUserCurrent = true;
        //     }
        //     getMenu(hasUserCurrent, (url) => {
        //         if (window.location.pathname) {
        //             url = window.location.pathname;
        //         }
        //         this.router.history.push(url);
        //         this.refreshMenu()
        //     })
        //     return (
        //         <Spin spinning={true}>
        //             <div style={{ width: '100vh', height: '100vw' }}>
        //             </div>
        //         </Spin>
        //     )
        // }
        // else if (!token && window.location.pathname != '/login') {
        //     return <Redirect push to="/login" />
        // }
        // if (this.router && this.router.history && this.router.history.CurrentUserParties) {
        //     account = this.router.history.CurrentUserParties.uppAccount.name;
        // }

        // ---------------------------------------------------------------------------

        if (!token && window.location.pathname != '/login') {
            return <Redirect push to="/login" />
        }
        if (this.router && this.router.history && this.router.history.CurrentUserParties) {
            account = this.router.history.CurrentUserParties.uppAccount.name;
        }

        //--------------------------------- jilin update end --------------------------------------

        const menu = (
            <Menu>
                <Menu.Item>
                    <strong>欢迎您,{account}</strong>
                </Menu.Item>
                <Menu.Item>
                    <a onClick={this.logout}><Icon type="logout" />
                        安全退出</a>
                </Menu.Item>
            </Menu>
        );
        // let isSupplyEnterprises = false; //是否是供给企业
        // if (this.router && this.router.history && this.router.history.CurrentUserParties) {
        //     if (this.router.history.CurrentUserParties.parties[0].partyIdentityCardType == 16) {
        //         isSupplyEnterprises = true;
        //     }
        // }
        let { current, selectedKeys, defaultOpenKeys, modalInfo } = this.state;

        let {siteServerUrl,showWebUrl, siteId} = this.state;
        let logoStyle = {
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            width: '200px',
            height: '67px',
            backgroundImage: this.state.logo.isSystemLogo ? 'url(/images/'+this.state.logo.logo+')' : 'url('+globalConfig.ApiUrl+this.state.logo.logo+')',
        }
        return (
            <Layout style={{ height: '100vh', minWidth: '100vw' }}>
                <Header style={{ background: '#001529', padding: 0, display: 'flex', justifyContent: 'space-between' }} >
                    <div style={{ display: 'flex' }}>
                        <div style={logoStyle}></div>
                        <Menu
                            onClick={this.handleClick}
                            selectedKeys={current}
                            theme="dark"
                            mode="horizontal"
                            style={{ lineHeight: '64px' }}
                        >
                            {menuArr}
                        </Menu>
                    </div>
                    <div style={{ float: 'right', zIndex: 100 }}>
                        {/* {isSupplyEnterprises ? (<Button type="primary" onClick={this.SettledOrganzation} style={{ marginRight: 15 }}>入驻机构</Button>) : ''} */}
                        {/* {showWebUrl ? (<Button type="primary" style={{ marginRight: '10px' }}><a target="_blank" href={showWebUrl}>查看站点</a></Button>) : ''} */}
                        {/* <Button type="primary" style={{ marginRight: '10px' }} loading={this.state.loading} onClick={this.changeRole}>切换账号角色</Button> */}
                        <Dropdown overlay={menu} placement="bottomCenter">
                            <div style={{ marginRight: '27px', display: 'inline-block' }}>
                                <b style={{
                                    color: "#fff"
                                }}>欢迎您，<span id="accountName">{account} </span></b>
                            </div>
                        </Dropdown>
                    </div>
                </Header>

                <Layout>
                    <Sider
                        /* collapsible  */
                        collapsed={this.state.collapsed}
                        style={{ overflowY: 'anto' }}
                    >
                        <Menu theme="dark"
                            selectedKeys={selectedKeys}
                            onClick={this.handelSidebarMenusClick}
                            onOpenChange={this.handelOpenChange}
                            openKeys={defaultOpenKeys}
                            mode="inline">
                            {this.state.submenuItem}
                        </Menu>
                    </Sider>
                    <Content style={{ margin: '0 16px', overflow: 'hidden' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            {this.getBreadCrumb()}
                        </Breadcrumb>
                        <div style={{ padding: 24, background: '#fff', height: 'calc( 100% - 133px )', overflow: 'hidden', overflowY: 'auto' }}>
                            <Switch>
                                {this.loginedRouteArr}
                                <Route exac path={"/Exception"} component={() => <Exception />} />
                                {/* <Route path={"/*"} component={() => <Exception />} /> */}
                                {/* <Route path={"/*"} component={() => <Redirect push to="/login" />} /> */}
                            </Switch>
                        </div>
                        {/* <UPPModal
                            destroyOnClose={true}
                            modalInfo={modalInfo}
                            width='600px'
                            handleCancel={this.handleCancelSubmit}>
                            {(modalInfo.title == '选择账号类型') &&
                                <div>
                                    <List
                                        size="small"
                                        // header={<div style={{ fontWeight: 'bold' }}>{}</div>}
                                        // footer={<div>Footer</div>}
                                        bordered
                                        dataSource={this.state.parties}
                                        renderItem={(item, key) => {
                                            return item.partyIdentityCardType != 24 && <List.Item>
                                                <div>
                                                    <span style={{ marginRight: '30px', fontWeight: 'bold' }}>
                                                        {item.partyIdentityCardTypeName}:
                                            </span>
                                                    {item.partyList.map((iteminner, index) => {
                                                        return <Tag color={this.state.key === key && this.state.index === index ? 'blue' : null} key={index} onClick={() => this.selectedRole(iteminner, key, index)}>{iteminner.viewPartyName}</Tag>
                                                    })}
                                                </div>
                                            </List.Item>
                                        }
                                        }
                                    />
                                    <div style={{ marginTop: '10px', textAlign: 'right' }}>
                                        <Button type='primary' style={{ marginRight: '10px' }} loading={this.state.loadingSecond} onClick={this.login}>确定</Button>
                                        <Button onClick={this.handleCancelSubmit}>取消</Button>
                                    </div>
                                </div>
                            }
                        </UPPModal> */}
                        <Footer style={{ textAlign: 'center' }}>
                            {/* 版权所有 Copyright © 2019 沈阳中睿教育有限公司. All Rights Reserved. */}
                            {this.state.logo.footer}
                        </Footer>

                    </Content>

                </Layout>
            </Layout>
        );
    }
    render() {
        const menuArr = this.state.menuArr;
        return (
            <LocaleProvider locale={zh_CN}>
                <Router ref={r => this.router = r} >
                    <Switch>
                        {this.unLoginRouteArr}
                        {this.renderLoginedView(menuArr)}
                        <Route path={"/*"} component={() => <Redirect push to="/login" />} />
                    </Switch>
                </Router>
            </LocaleProvider>
        );
    }
}
