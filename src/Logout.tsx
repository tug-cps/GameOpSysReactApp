import {useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import BackendService from "./service/BackendService";
import {LinearProgress} from "@material-ui/core";


function Logout(props: { backendService: BackendService }) {
    const {push} = useHistory();
    const {backendService} = props;

    useEffect(() => {
        backendService
            .logout()
            .catch(console.log)
            .then(() => push("/login"))
    }, [backendService, push]);

    return <LinearProgress/>;
}

export default Logout;
