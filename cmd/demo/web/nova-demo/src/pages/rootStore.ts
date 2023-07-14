import managerStore, {ManagerStore} from "@/pages/manager/managerStore";


class RootStore {
    private managerStore: ManagerStore;
    constructor() {
        this.managerStore = managerStore;
    }
}

export const rootStore = new RootStore();