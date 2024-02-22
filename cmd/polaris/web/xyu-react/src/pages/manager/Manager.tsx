import {Navigate} from "react-router-dom";


export const Manager = () => {

    return (
        <Navigate
            to={`/manager/screen`}
            replace
        />
    );
}

export default Manager