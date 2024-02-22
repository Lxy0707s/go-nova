import {Switch} from "antd";

const updateDarkMode= async (dark:boolean)=>{
    if (typeof  window === 'undefined') return;
    if (typeof  window.MutationObserver === 'undefined') return;

    if (dark) {
        const defaultTheme = {
            brightness: 100,
            contrast: 90,
            sepia: 10,
        };

        const defaultFixes = {
            inert:[],
            css: '',
            ignoreInlineStyle: ['.react-switch-handle'],
            ignoreImageAnalysis: [],
            disableStyleSheetsProxy: true,
        };
        // if () {
        //     setFetch(window.fetch)
        // }
    }
}

/** 省略 **/
const GlobalHeaderRight: React.FC = () => {
    /** 省略 **/

    const switchDarkMode = () => {
        //点击开关触发主题的切换
        localStorage.setItem("darkMode", darkMode ? "0" : "1");
        darkMode = !darkMode;
        updateDarkMode(darkMode); //这里是调用上面复制的updataTheme方法
    };
    //设置一个darkMode变量, 来切换开关的状态
    let darkMode = localStorage.getItem("darkMode") == "1";
    //更新一下黑暗模式的状态
    updateDarkMode(darkMode);

    /** 省略 **/
    return (
        /** 省略 **/

        //开关组件在这定义
        <Switch checkedChildren="🌜" unCheckedChildren="🌞" onClick={switchDarkMode} defaultChecked={darkMode} size={"small"}></Switch>
    );
    /** 省略 **/
};
export default GlobalHeaderRight;
