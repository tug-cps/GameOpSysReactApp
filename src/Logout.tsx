import {useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import BackendService from "./service/BackendService";
import {LinearProgress} from "@mui/material";
import useDefaultTracking from "./common/Tracking";

function Logout(props: { backendService: BackendService }) {
    const {Track} = useDefaultTracking({page: 'Logout'});
    const {push} = useHistory();
    const {backendService} = props;

    useEffect(() => {
        backendService
            .logout()
            .catch(console.log)
            .then(() => push("/"))
    }, [backendService, push]);

    return <Track><LinearProgress/></Track>;
}

export default Logout;
