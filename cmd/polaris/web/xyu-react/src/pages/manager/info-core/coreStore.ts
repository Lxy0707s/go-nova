import moment from "moment/moment";
import {action, makeObservable, observable} from "mobx";
import {RoutesType, TreeSourceData} from "@/models/menu.type";
import {UserBasicParam, UserRoleType} from "@/models/user.type";
import {RoleParam, RoleType} from "@/models/role.type";
import {PowerParam} from "@/models/power.type";
import {Res} from "@/models/response.type";

class CoreStore {
    rootStore: any;
    constructor(rootStore:any) {
        this.rootStore = rootStore;
        makeObservable(this); //mbox 6后需要添加这个组件才会更新
    }

    @observable
    tagColor: string[] = ["#87d068", "#108ee9", "#07b1fd", "#f2c55c"]

    // -----------------------store-type---------------------------
    @observable
    idSequence = 1000;
    @observable
    defaultMPs: Res
    @observable // 当前时间
    time = moment().format('YYYY-MM-DD HH:mm:ss');
    @observable // table 加载状态
    loading: boolean = false;
    @observable powerTreeData:TreeSourceData[]= []


    /**----------------------------- 用户user相关  -----------------------------**/

    @action
    getEntireUserInfo = (userID:number) => {
        return this.rootStore.refreshUserInfo(userID)
    }

    @action updateUser(newUser: UserBasicParam){
        return this.rootStore.updateUser(newUser)
    }

    @action addUser(userList: UserBasicParam[]){
       return this.rootStore.addUser(userList)
    }

    @action
    async deleteUser(uid: number){
        return this.rootStore.deleteUser(uid)
    }

    /** 用户-角色数据 **/
    @action
    setUserRoles(uRdata: UserRoleType){
        return this.rootStore.setUserRoles(uRdata)
    }

    /**----------------------------- 角色role相关 -----------------------------**/

    @action
    getRoleNameByUid(uid: number) {
        return this.rootStore.getRoleName(uid)
    }

    @action addRole(roles: RoleType[]) {
        return this.rootStore.addRoleData(roles)
    }

    @action updateRole = (newRole: RoleParam) => {
        return this.rootStore.updateRoleData(newRole)
    }

    @action
    async deleteRole(uid: number) {
        return this.rootStore.delRoleData(uid)
    }

    @action resetRole() {
        this.rootStore.reRole();
        this.loading = false;
    }

    /**----------------------------- 权限菜单相关  -----------------------------**/
    @action getTreeData(){
        this.powerTreeData = this.rootStore.getTreeData()
        return this.powerTreeData
    }

    // menu
    @action
    upMenuByParams(params: RoutesType) {
        return this.rootStore.upMenu(params)
    }

    @action
    findChildMenu(key: string){
        return this.rootStore.findChildMenu(key)
    }

    @action
    addMenuByParams(params: RoutesType) {
        return this.rootStore.addMenu(params)
    }

    @action
    delMenu(params: { key: string }) {
        return this.rootStore.deleteMenu(params)
    }

    /**----------------------------- 权限数据操作相关  -----------------------------**/
    @action
     getPowerDataByMenuId(params: { menuId: string | null }) {
       return this.rootStore.getPowerById(params)
    }

    @action
    addPower(params: PowerParam) {
        return this.rootStore.addPowerData(params);
    }

    @action
    upPower(params: PowerParam) {
        return this.rootStore.upPowerData(params)
    }

    @action
    checkPower =  (params: { authCode: string })=>{
        return this.rootStore.checkPowerData(params)
    }

    @action
    delPower(params: { id: number }) {
        return this.rootStore.delPowerData(params)
    }


    /**----------------------------- 菜单-数据权限相关  -----------------------------**/
    @action
    getAllMenusAndPowers() {
        const mp = this.rootStore.allMenusAndPowers()
        return mp.data
    }

    /**
     *  根据角色的uid, 维护每个角色的菜单，权限数据
     */
    @action
    setRoleMPs(params: {id:number, menus: string[], powers:number[]}){
        return this.rootStore.setRoleMP(params)
    }

    @action
    getMenuAndPowerByUid(uid: number) {
       return this.rootStore.getMPDataByUid(uid)
    }
}

export {CoreStore}