import React from 'react';
import {useHistory} from 'react-router-dom';
import {apiClient} from "./common/ApiClient";


function Logout() {
    const history = useHistory();

    apiClient.logout().finally(() => {
        history.push("/login");
    })
    return (<div/>)
}

export default Logout;
