import {observable, action, makeObservable} from 'mobx';
import {defaultDatas, DetailsListType} from "./model.interface"
import {mapDataApi, detailsApi} from "@/apis";
import { galApi } from '@/apis';

class ScreenStore {
    constructor() {
        makeObservable(this); //mbox 6后需要添加这个组件才会更新
    }

    // -----------------------store-type---------------------------
    @observable // table 加载状态
    loading: boolean = false;
    @observable // 事件列表
    mapData:any = {};
    @observable
    detailsList:DetailsListType[] = []

    // -----------------------action---------------------------
    // Query
    @action async queryMapData() {
        this.loading = true;
        const response = await mapDataApi();
        action(() => {
            this.mapData = (response && response.data) ? response.data: defaultDatas.mapData;
        })();
    };

    // Query
    @action async queryDetailsList() {
        this.loading = true;
        const response = await detailsApi()
        action(() => {
            this.detailsList = (response && response.data) ? response.data : defaultDatas.detailsList;
        })();
    }
    // Gql
    @action async queryGql() {
        this.loading = true;
        try {
            const dataJson =  await galApi("");
        }catch (e) {
        }
    }
}

const screenStore = new ScreenStore();

export default screenStore;

export {ScreenStore};