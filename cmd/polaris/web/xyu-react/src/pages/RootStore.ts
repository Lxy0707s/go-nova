import screenStore, {ScreenStore} from "./home/screen/store";
import  {LoginStore} from "@/pages/login/loginStore";
import {action, observable} from "mobx";
import {UserBasicParam, UserBasicType, UserInfo, UserLoginType, UserRoleType} from "@/models/user.type";
import {RoleMpType, RoleParam, RoleType} from "@/models/role.type";
import {PowerParam} from "@/models/power.type";
import {DefaultPowers, DefaultRoleList, DefaultRoleMps, DefaultUserInfo, DefaultUserList} from "@/pages/defaultData";
import {rootMenu, RoutesType} from "@/models/menu.type";
import {dataToTreeSourceData, defaultRouteData} from "@/config/config.model";
import {getSysRole, getUser} from "@/apis";
import {getToken} from "@/utils/tool/authority";
import {getRolePower} from "@/apis/roleApi";
import {message} from "antd";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;
import {CoreStore} from "@/pages/manager/info-core/coreStore";

/**
 *  RootStore: 负责前端项目初始化，存储关键数据
 *  数据树的更新在各自的组件，并不在rootStore中提供更新方法，由各组件自己更新
 */
class RootStore {
    screenStore: ScreenStore;
    coreStore: CoreStore;
    loginStore: LoginStore;
    rootStore: RootStore;
    constructor() {
        this.screenStore = screenStore;
        this.coreStore = new CoreStore(this);
        this.rootStore = this;
        this.loginStore = new LoginStore(this);
    }

    // -----------------------store-type---------------------------
    @observable
    idSequence = 1000;
    @observable
    userStatus: UserLoginType = {userID:0, status: 0, token: ""} // 默认不存在

    @observable
    users:UserBasicType[] = DefaultUserList
    @observable
    roles:RoleType[] = DefaultRoleList;
    @observable
    freshMenu:boolean = false
    @observable
    menus: RoutesType[] = defaultRouteData
    @observable
    powers: PowerParam[] = DefaultPowers
    @observable
    roleMpData: RoleMpType[] = DefaultRoleMps
    @observable
    userinfo: UserInfo = DefaultUserInfo;

    /**----------------------------- 登录相关  -----------------------------**/
    /**
     * 登录成功后，设置用户全局UID
     * @param uid
     * */
    @action
    setLoginId(uid: number) {
        console.log("用户完成登录,uid", uid)
        this.userStatus.userID = uid
        return uid;
    }

    @action
    updateUserStatus = (p: { id: number; token: string ; status: number }) => {
        this.userStatus.userID = p.id;
        this.userStatus.token = p.token;
        this.userStatus.status = p.status;
    }

    @action
    initAppData = ()=> {
        if (this.userStatus.status === 0){
            return
        }
        this.initUser();
        this.initPower();
        this.initMps();
        this.refreshUserInfo(this.userStatus.userID);
    }

    @action
    initUser () {
        if (this.users.length !== 0) {
            return
        }
        this.users = DefaultUserList
        // getUser(getToken()).then((response:any)=>{
        //     if (response && response.data === null) {
        //         // todo 待接口实现
        //         // set
        //     }else {
        //         // if (this.users.length !== 0) {
        //         //     return
        //         // }
        //         this.users = DefaultUserList
        //     }
        // }).catch(()=>{});
    };

    @action
    refreshUserInfo = (userID:number) => {
        let userData: UserBasicType = {}
        const roleMpData: RoleMpType= {menus:["1"],powers:[]}
        let roleData: number[] = []
        // 变量用户表
        this.users.forEach((value,index)=>{
            if (value.uid === userID) {
                userData = value;
                roleData = value.roleIds;
            }
        })
        if (roleData.length === 0){
            this.userinfo = {
                userBasicInfo: userData,
                roles: [],
                menus: [],
                powers: [],
            }
            console.log("初始化完成0", this.userinfo)
            return
        }
        roleData.forEach( (id,index)=>{
            roleMpData.id = id
            // 根据role uid从roleMps数据中获取menus,powers
            const resp =  this.getMPDataByUid(id);
            if (resp.status === 200 && resp.data){
                if (resp.status === 200){
                    roleMpData.menus.push(...resp.data.menus);
                    roleMpData.powers.push(...resp.data.powers);
                }
                this.userinfo = {
                    userBasicInfo: userData,
                    roles: roleData,
                    ...roleMpData
                }
            }
        });
        console.log("初始化完成1", this.userinfo)
    }

    @action addUser(userList: UserBasicParam[]){
        userList.map((user)=>{
            let tmp = user
            tmp.id = this.users[this.users.length-1].id + 1
            tmp.uid = this.users[this.users.length-1].uid + 101
            tmp.roleIds = []
            tmp.createdAt = Date.now().toString()
            tmp.updatedAt = Date.now().toString()
            this.users.push(tmp);
        })
        return { status: 200, data: this.users, message: "success" };
    }

    @action
    async deleteUser(uid: number){
        // todo 请实现删除角色后端接口，同时后端需要支持一起删除对应的权限数据
        const oldIndex = this.users.findIndex(function (item:UserBasicType) {
            return item.uid === uid;
        });
        if (oldIndex !== -1) {
            this.users.splice(oldIndex, 1);
            return  { status: 200, data: this.users || [], message: "success" }
        } else {
            return { status: 204, data: this.users || [], message: "no data find!" };
        }
    }

    @action updateUser(newUser: UserBasicParam){
        try {
            this.users.forEach((value,index,) => {
                if (value.uid === newUser.uid) {
                    const roles = value.roleIds
                    this.users[index] = newUser;
                    this.users[index].roleIds = roles
                    this.users[index].updatedAt = Date.now().toString();
                }
            });
        }catch (err){
            return  { status: 502, data: this.users || [], message: err.message }
        }
        return { status: 200, data: this.users, message: "success" };
    }

    /** 用户-角色数据 **/
    @action
    setUserRoles(uRdata: UserRoleType){
        let resData = {users: this.users, status: 0}
        let status = 0
        if (this.userStatus.userID === uRdata.id){
            status = 1
        }
        try {
            this.users.forEach((user:UserBasicType, index:number)=>{
                if (user.uid === uRdata.id) {
                    this.users[index].roleIds = uRdata.roles
                }
            })
        }catch (err){
            return  { status: 502, data: resData, message: err.message }
        }
        resData = {
            users: this.users,
            status: status
        }
        return  { status: 200, data: resData, message: "success" }
    }

    @action
    queryUserId(params: {userName:string, password:string}){
        const index = this.users.findIndex(function (user) {
            return user.username === params.userName && user.password === params.password;
        });
        if (index !== -1) {
            return this.users[index].uid
        }
        message.warning("当前用户不存在，请重新登录!!!").then(null)
        return 0;
    }

    // --------------- role ---------

    @action
    getRole = () => {
        return this.roles
    }

    @action addRoleData(roles: RoleType[]) {
        try {
            roles.map((role)=>{
                let tmp = role
                tmp.id = this.roles[this.roles.length-1].id + 1
                tmp.uid = this.roles[this.roles.length-1].uid + 101
                tmp.createdAt = Date.now().toString()
                tmp.updatedAt = Date.now().toString()
                this.roles.push(tmp);
            })
        }catch (err){
            return  { status: 502, data: this.roles || [], message: err.message }
        }
        return { status: 200, data: this.roles, message: "success" };
    }

    @action
    async delRoleData(uid: number) {
        let resData = {role: this.roles, status: 0}
        let status = 0
        try {
            // 更新用户-角色id信息
            this.users.forEach((user,index)=>{
                const index0 = user.roleIds.findIndex(function (roleID:number) {
                    return roleID == uid
                })
                if (index0 !== -1 ){
                    if (this.users[index].uid === this.userStatus.userID){
                        status = 1;
                    }
                    this.users[index].roleIds.splice(index0,1)
                }
            })
            // 更新角色-菜单信息
            this.roleMpData.forEach((value,index)=>{
                if (value.id === uid){
                    this.roleMpData.splice(index,1)
                }
            })
            const oldIndex = this.roles.findIndex(function (role:RoleType) {
                return role.uid === uid;
            });
            if (oldIndex !== -1) {
                this.roles.splice(oldIndex, 1);
                //this.getEntireUserInfo(this.rootStore.userStatus.userID)
                resData = {
                    role: this.roles,
                    status: status
                }
                return { status: 200, data: resData, message: "success" };
            } else {
                return { status: 204, data: resData, message: "no data find!" };
            }
        }catch (err){
            return  { status: 502, data: resData, message: err.message }
        }
    }

    @action updateRoleData = (newRole: RoleParam) => {
        try {
            this.roles.forEach((value,index,) => {
                if (value.uid === newRole.uid) {
                    this.roles[index] = newRole;
                    this.roles[index].updatedAt = Date.now().toString();
                }
            });
        }catch (err){
            return  { status: 502, data: this.roles || [], message: err.message }
        }
        return { status: 200, data: this.roles, message: "success" };
    }

    @action reRole() {
        this.roles = [];
    }

    @action
    getRoleName(uid: number) {
        let roleInfo = {
            name: "unknown",
            conditions: 0
        }
        try {
            this.roles.forEach((role, index)=>{
                if (role.uid == uid){
                    roleInfo.name = role.role
                    roleInfo.conditions = role.conditions
                }
            })
        }catch (err){
            return  { status: 502, data: roleInfo, message: err.message }
        }
        return  { status: 200, data: roleInfo, message: "success" }
    }

    @action
    getUserPower = () => {
        let res: PowerParam[] = [];
        const powers =  this.userinfo.powers
        try {
            // const p = JSON.parse(request.body);
            if (powers instanceof Array) {
                const  ids = Array.from(powers)
                res = this.powers.filter(function (item) {
                    return ids.includes(item.id);
                });
            } else {
                const t = this.powers.find(function (item) {
                    return item.id === powers;
                });
                res.push(t);
            }
        } catch (err) {
            message.error("网络错误，请重试").then(null);
        }
        return res;
    }


    /**----------------------------- 权限菜单相关  -----------------------------**/
    @action getTreeData(){
        return dataToTreeSourceData(this.menus)
    }

    /**
     * 修改菜单
     * **/
    @action
    upMenu(params: RoutesType) {
        const oldIndex = this.menus.findIndex(function (item) {
            return item.key === params.key;
        });
        if (oldIndex !== -1) {
            const news = Object.assign({}, this.menus[oldIndex], params);
            this.menus.splice(oldIndex, 1, news);
            return { status: 200, data: this.menus, message: "success" };
        } else {
            return { status: 204, data: null, message: "未找到该条数据" };
        }
    }

    @action
    findChildMenu(key: string){
        // key =3  key = 3.3.1
        const index = this.menus.findIndex(function (item) {
            // item.key =3.3.1 没有
            return item.key !== key && item.key.startsWith(key);
        });
        return index !== -1;
    }

    @action
    addMenu(params: RoutesType) {
        try {
            this.menus.push(params);
            return { status: 200, data: this.menus, message: "添加成功" };
        } catch (err) {
            message.error("网络错误，请重试");
        }
        return;
    }

    @action
    deleteMenu = (params: { key: string }) =>{
        try {
            const index = this.menus.findIndex(function (item) {
                return item.key === params.key;
            });

            if (index !== -1) {
                // 更新角色-权限信息
                this.roleMpData.forEach((roleMp,index)=>{
                    const index0 = roleMp.menus.findIndex(function (menu_key:string) {
                        return menu_key == params.key
                    })
                    if (index0 !== -1 ){
                        this.roleMpData[index].menus.splice(index0,1)
                    }
                })
                const haveChild = this.menus.findIndex(function (item) {
                    return item.parent_key === params.key;
                });
                if (haveChild === -1) {
                    this.menus.splice(index, 1);
                    this.updateRoleMps({powerID: index})
                    return { status: 200, data: this.menus, message: "success" };
                } else {
                    return { status: 204, data: null, message: "该菜单下有子菜单，无法删除" };
                }
            } else {
                return { status: 204, data: null, message: "未找到该条数据" };
            }
        } catch (err) {
            message.error("网络错误，请重试");
        }
        return;
    }



    @action
    getMPDataByUid(uid: number) {
        let res: {menus: string[], powers: number[]} = {menus: [], powers: []}
        try {
            this.roleMpData.forEach((value,index)=>{
                if (value.id == uid) {
                    res = {menus: value.menus, powers: value.powers}
                }
            })
        } catch (err) {
            message.error("网络错误，使用旧数据渲染，操作无效，请联系管理员!!!").then(null);
            return { status: 502,  data: res, message: err.message}
        }
        return { status: 200, data: res, message: "success"}
    }


    // -------------- 权限数据-----------
    @action
    initPower = () =>{
        if (this.powers.length !== 0) {
            return
        }
        this.powers = DefaultPowers
        // getSysRole(getToken()).then((response:any)=>{
        //     if (response && response.data === null) {
        //         // todo 待接口实现
        //         // set
        //     }else {
        //         // if (this.powers.length !== 0) {
        //         //     return
        //         // }
        //         this.powers = DefaultPowers
        //     }
        // }).catch(()=>{});
    };

    @action
    getPowerById(params: { menuId: string | null }) {
        const menuId = params.menuId;
        if (menuId) {
            return {
                status: 200,
                data: this.powers
                    .filter(function (item) {
                        return item.menu_key === menuId;
                    })
                    .sort(function (a, b) {
                        return a.sorts - b.sorts;
                    }),
                message: "success",
            };
        } else {
            return { status: 200, data: [], message: "success" };
        }
    }

    /**
     * 添加权限
     * **/
    @action
    addPowerData(params: PowerParam) {
        try {
            const index = this.powers.findIndex((power)=>{
                return power.auth_code == params.auth_code || power.title === params.title
            })
            if (index === -1){
                message.warning("权限码或权限名称重复").then(null);
                return
            }
            params.id = ++this.idSequence;
            params.uid = params.id
            this.powers.push(params);
            return { status: 200, data: { id: params.id }, message: "success" };
        } catch (err) {
            message.error("网络错误，请重试").then(null);
        }
        return;
    }


    /**
     * 修改权限
     * **/
    @action
    upPowerData(params: PowerParam) {
        try {
            const oldIndex = this.powers.findIndex(function (item) {
                return item.uid === params.uid;
            });
            if (oldIndex !== -1) {
                const news = Object.assign({}, this.powers[oldIndex], params);
                this.powers.splice(oldIndex, 1, news);
            } else {
                return { status: 204, data: null, message: "未找到该条数据" };
            }
        } catch (err) {
            message.error("网络错误，请重试").then(null);
        }
        return { status: 200, data: { id: params.id }, message: "success" };
    }

    /**
     * 根据power id(s)和权限校验码进行权限检测, 不依赖后端
     * 返回值：Boolean
     * @param params
     */
    @action
    checkPowerData =  (params: { authCode: string })=>{
        let flag = false
        const powers =  this.getUserPower()
        if (powers){
            powers.forEach((value:PowerParam)=>{
                if (value.auth_code === params.authCode) {
                    flag = true;
                }
            });
            return flag
        }
    }

    /**
     * 删除权限
     * **/
    @action
    delPowerData(params: { id: number }) {
        try {
            const index = this.powers.findIndex(function (item) {
                return item.id === params.id;
            });

            if (index !== -1) {
                this.powers.splice(index, 1);
                this.updateRoleMps({powerID:index})
                return { status: 200, data: null, message: "success" };
            } else {
                return { status: 204, data: null, message: "未找到该条数据" };
            }
        } catch (err) {
            message.error("网络错误，请重试").then(null);
        }
        return;
    }


    /**----------------------------- 菜单-数据权限相关  -----------------------------**/
    @action
    initMps = () =>{
        if (this.roleMpData.length !== 0) {
            return
        }
        this.roleMpData = DefaultRoleMps
        // getRolePower(getToken()).then((response:any)=>{
        //     if (response && response.data === null) {
        //         // todo 待接口实现
        //         // set
        //     }else {
        //         // if (this.roleMpData.length !== 0) {
        //         //     return
        //         // }
        //
        //     }
        // }).catch(()=>{});
    }

    @action
    allMenusAndPowers() {
        const powersData = this.powers;
        const res = this.menus.map(function (item) {
            const _menu = item;
            _menu.powers = powersData.filter(function (v) {
                return v.menu_key === item.key && v.conditions === 1;
            });
            return _menu;
        });
        let list = dataToTreeSourceData(res) //[0].children
        return { status: 200, data: list, message: "success" };
    }

    /**
     *  根据角色的uid, 维护每个角色的菜单，权限数据
     */
    @action
    setRoleMP(params: {id:number, menus: string[], powers:number[]}){
        let status = 0
        const index = this.roleMpData.findIndex(function (item) {
            return item.id === params.id;
        });
        if (index !== -1) {
            this.freshMenu = !this.freshMenu
            this.roleMpData[index].menus = params.menus;
            this.roleMpData[index].powers = params.powers
        }else {
            this.roleMpData.push(params)
        }
        this.refreshUserInfo(this.userStatus.userID)
        this.users.forEach((user,index)=>{
            const index0 = user.roleIds.findIndex(function (roleID:number) {
                return roleID == params.id
            })
            if (index0 !== -1 ){
                if (this.users[index].uid === this.userStatus.userID){
                    status = 1;
                }
            }
        })
        return status
    }

    @action
    updateRoleMps = (params:{powerID?:number, MenuID?: string}) =>{
        if (!(params.powerID || params.MenuID)){
            return
        }
        // 更新menus
        if (params.MenuID){
            this.roleMpData.forEach(
                (value: RoleMpType, roleIndex: number) => {
                    const index = value.menus.findIndex(function (UId:string) {
                        return UId === params.MenuID;
                    })
                    if (index !== -1) { //清理数据
                        this.roleMpData[roleIndex].menus.splice(index,1)
                    }
                }
            )
        }
        // 更新powers
        if (params.powerID){
            this.roleMpData.forEach(
                (value: RoleMpType, roleIndex: number) => {
                    const index = value.powers.findIndex(function (UId:number) {
                        return UId === params.powerID;
                    })
                    if (index !== -1) { //清理数据
                        this.roleMpData[roleIndex].powers.splice(index,1)
                    }
                }
            )
        }
    }
}

export const rootStore = new RootStore();

export {RootStore}