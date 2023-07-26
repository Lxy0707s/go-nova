import {observable, action, makeObservable} from 'mobx';
import {userDataApi,galApi} from "@/apis/CoreApi";
import {defaultDatas, UserType} from "@/pages/manager/model.interface";

class ManagerStore {
    constructor() {
        makeObservable(this); //mbox 6后需要添加这个组件才会更新
    }

    // -----------------------store-type---------------------------
    @observable // table 加载状态
    loading: boolean = false;
    @observable // 用户信息列表
    userList: UserType[] = []

    @action async queryUserList (){
        this.loading = true;
        const dataJson  = await userDataApi();
        await galApi()
        action(() => {
            this.userList = dataJson != null ? dataJson: defaultDatas.userList;
        })();
    }

}


const managerStore = new ManagerStore();

export default managerStore;

export {ManagerStore};