import {useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import BackendService from "./service/BackendService";


function Logout(props: {backendService: BackendService}) {
    const history = useHistory();

    useEffect(() => {
        props.backendService
            .logout()
            .catch((error) => console.log(error))
            .then(() => history.push("/login"))
    });

    return null;
}

export default Logout;
