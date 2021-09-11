import {useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import BackendService from "./service/BackendService";
import {LinearProgress} from "@material-ui/core";
import {useTracking} from "react-tracking";

function Logout(props: { backendService: BackendService }) {
    const {Track} = useTracking({page: 'Logout'}, {dispatchOnMount: true});
    const {push} = useHistory();
    const {backendService} = props;

    useEffect(() => {
        backendService
            .logout()
            .catch(console.log)
            .then(() => push("/login"))
    }, [backendService, push]);

    return <Track><LinearProgress/></Track>;
}

export default Logout;
