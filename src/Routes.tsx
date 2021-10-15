import {LinearProgress} from "@mui/material";
import {Redirect, Route, Switch} from "react-router-dom";
import Login from "./Login";
import Verify from "./Verify";
import Logout from "./Logout";
import Upload from "./Upload";
import User from "./User";
import Power from "./Power";
import Archive from "./Archive";
import Consumers from "./Consumers";
import Behavior from "./Behavior";
import React, {useContext} from "react";
import Home from "./Home";
import Thermostats from "./Thermostats";
import BackendService from "./service/BackendService";
import Mood from "./Mood";
import {PrivateRouteProps, UserContext} from "./App";
import {Page404} from "./Page404";
import PastBehavior from "./PastBehavior";
import {LoadingPage} from "./LoadingPage";

export function PublicRouter(props: { backendService: BackendService }) {
    return <>
        <Redirect to="/login"/>
        <Switch>
            <Route path="/verify"><Verify {...props}/></Route>
            <Route path="/login"><Login {...props}/></Route>
            <Route><Page404 path="/login"/></Route>
        </Switch>
    </>
}

export function LoadingRouter(props: { backendService: BackendService, retry: () => void }) {
    return (
        <Switch>
            <Route path="/logout"><Logout {...props}/></Route>,
            <Route exact path="/"><LoadingPage retry={props.retry}/></Route>,
            <Route exact path={`${process.env.PUBLIC_URL}`}><LoadingPage retry={props.retry}/></Route>,
            <Route><Page404 path="/"/></Route>
        </Switch>
    )
}

export function PrivateRouter(props: PrivateRouteProps) {
    const user = useContext(UserContext);
    if (user === undefined) return <LinearProgress/>;

    const paths = {
        logout: <Route path="/logout"><Logout {...props}/></Route>,
        upload: <Route path="/upload"><Upload {...props}/></Route>,
        user: <Route path="/user"><User {...props}/></Route>,
        power: <Route path="/power"><Power {...props}/></Route>,
        archive: <Route path="/archive"><Archive {...props}/></Route>,
        consumers: <Route path="/consumers"><Consumers {...props}/></Route>,
        behavior: <Route path="/behavior"><Behavior {...props}/></Route>,
        pastbehavior: <Route path="/pastbehavior"><PastBehavior {...props}/></Route>,
        mood: <Route path="/mood"><Mood {...props}/></Route>,
        thermostats: <Route path="/thermostats"><Thermostats {...props}/></Route>,
        root: <Route exact path="/"><Home {...props}/></Route>,
        home: <Route exact path={`${process.env.PUBLIC_URL}`}><Home {...props}/></Route>,
    }

    const commonPaths = [paths.logout, paths.user, paths.home, paths.root]
    const managementPaths = [paths.upload];
    const homeOwnerPaths = [paths.upload, paths.power, paths.consumers, paths.behavior, paths.mood];
    const studentPaths = [paths.archive, paths.consumers, paths.behavior, paths.mood, paths.pastbehavior];

    return (
        <Switch>
            {user.type === "management" && managementPaths}
            {user.type === "student" && studentPaths}
            {user.type === "homeowner" && homeOwnerPaths}
            {commonPaths}
            <Route><Page404 path="/"/></Route>
        </Switch>
    )
}
