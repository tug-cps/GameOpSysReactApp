import {LinearProgress} from "@mui/material";
import React, {useContext} from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import {PrivateRouteProps, UserContext} from "./App";
import Archive from "./Archive";
import Behavior from "./Behavior";
import Consumers from "./Consumers";
import Feedback from "./Feedback";
import Home from "./Home";
import LoadingPage from "./LoadingPage";
import Login from "./Login";
import Logout from "./Logout";
import Page404 from "./Page404";
import PastBehavior from "./PastBehavior";
import BackendService from "./service/BackendService";
import Upload from "./Upload";
import User from "./User";
import Verify from "./Verify";
import WellBeing from "./WellBeing";

export function PublicRouter(props: { backendService: BackendService }) {
    return (
        <Switch>
            <Route path="/verify"><Verify {...props}/></Route>
            <Route exact path="/login"><Login {...props}/></Route>
            <Route exact path="/"><Login {...props}/></Route>
            <Route exact path={`${process.env.PUBLIC_URL}/`}><Login {...props}/></Route>
            <Route><Redirect to='/'/></Route>
        </Switch>
    )
}

export function LoadingRouter(props: { backendService: BackendService, retry: () => void }) {
    return (
        <Switch>
            <Route path="/logout"><Logout {...props}/></Route>,
            <Route><LoadingPage {...props}/></Route>,
        </Switch>
    )
}

export function PrivateRouter(props: PrivateRouteProps) {
    const user = useContext(UserContext);
    if (user === undefined) return <LinearProgress/>;

    const paths = {
        logout: () => <Route path="/logout"><Logout {...props}/></Route>,
        upload: () => <Route path="/upload"><Upload {...props}/></Route>,
        user: () => <Route path="/user"><User {...props}/></Route>,
        archive: () => <Route path="/archive"><Archive {...props}/></Route>,
        consumers: () => <Route path="/consumers"><Consumers {...props}/></Route>,
        behavior: () => <Route path="/behavior"><Behavior {...props}/></Route>,
        pastbehavior: () => <Route path="/pastbehavior"><PastBehavior {...props}/></Route>,
        wellBeing: () => <Route path="/wellBeing"><WellBeing {...props}/></Route>,
        feedback: () => <Route path="/feedback"><Feedback {...props}/></Route>,
        root: () => <Route exact path="/"><Home {...props}/></Route>,
        home: () => <Route exact path={`${process.env.PUBLIC_URL}/`}><Home {...props}/></Route>,
    }

    const commonPaths = [paths.logout(),
        paths.user(),
        paths.home(),
        paths.root(),
        paths.archive(),
        paths.consumers(),
        paths.behavior(),
        paths.wellBeing(),
        paths.pastbehavior(),
        paths.feedback()
    ]
    const homeOwnerPaths = [paths.upload()];

    return (
        <Switch>
            {user.type === "homeowner" && homeOwnerPaths}
            {commonPaths}
            <Route><Page404/></Route>
        </Switch>
    )
}
