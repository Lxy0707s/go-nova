import RenderAuthorize from "@/components/authorized";
import {getAuthority} from "@/utils/tool/authority";

let Authorized = RenderAuthorize(getAuthority("")); // Reload the rights component

const reloadAuthorized = () => {
    Authorized = RenderAuthorize(getAuthority(""));
};
/**
 * hard code
 * block need it。
 */

export { reloadAuthorized };
export default Authorized;