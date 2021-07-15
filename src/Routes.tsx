import {Route, Switch} from "react-router-dom";
import PrivateRoute from "./common/PrivateRoute";
import Login from "./Login";
import Verify from "./Verify";
import Logout from "./Logout";
import Upload from "./Upload";
import User from "./User";
import Power from "./Power";
import Archive from "./Archive";
import Consumers from "./Consumers";
import Behavior from "./Behavior";
import React from "react";
import Home from "./Home";

const ReactRouter = () => {
    return (
        <Switch>
            <PrivateRoute path="/" exact component={Home}/>
            <Route path="/login" component={Login}/>
            <Route path="/verify" component={Verify}/>
            <PrivateRoute path="/logout" component={Logout}/>
            <PrivateRoute path="/upload" component={Upload}/>
            <PrivateRoute path="/user" component={User}/>
            <PrivateRoute path="/power" component={Power}/>
            <PrivateRoute path="/archive" component={Archive}/>
            <PrivateRoute path="/consumers" component={Consumers}/>
            <PrivateRoute path="/behavior" component={Behavior}/>
            <Route component={() => (<div>404 Not found</div>)}/>
        </Switch>
    )
}

export default ReactRouter;