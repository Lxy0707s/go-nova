import {action, makeObservable, observable} from "mobx";
import {defaultToken, LoginParamsType} from "./model.interface";
import moment from "moment/moment";
import {setAuthority, setToken} from "@/utils/tool/authority";

class LoginStore {
    rootStore: any;

    constructor(rootStore) {
        this.rootStore = rootStore
        makeObservable(this); //mbox 6后需要添加这个组件才会更新
    }

    // -----------------------store-type---------------------------
    @observable
    timeStr: string = moment().format('YYYY-MM-DD HH:mm:ss');
    @observable // table 加载状态
    loading: boolean = false;
    @observable // token
    loginToken: string = "";
    @observable // 登录信息
    loginInfo:LoginParamsType = null

    @action setToken(value:any) {
        const auth = value ? value.authorization : defaultToken;
        setAuthority(value.authorization);
        setToken(auth)
    }

    @action clearToken() {
        setToken(null)
    }

    @action getNow = () => {
        this.timeStr = moment().format('YYYY-MM-DD HH:mm:ss');
        return this.timeStr
    }

    @action onGetEmail = (email: any) =>{
        return true
    }
    @action async login (params:LoginParamsType)  {
        const  uid = this.rootStore.queryUserId({userName: params.userName, password: params.password})
        if(uid !== 0){
            this.rootStore.setLoginId(uid)
            return true
        }else {
            return null
        }
        // todo 下面是实际接口请求，需要后端支持
        // const dataJson = await  loginApi(params)
        // if (dataJson === null) {
        //     return error(null)
        // }
    }
}

export {LoginStore};