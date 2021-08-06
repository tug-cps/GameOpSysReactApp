import {Link, Redirect, Route, Switch} from "react-router-dom";
import Login from "./Login";
import Verify from "./Verify";
import Logout from "./Logout";
import Upload from "./Upload";
import User from "./User";
import Power from "./Power";
import Archive from "./Archive";
import Consumers from "./Consumers";
import Behavior from "./Behavior";
import React, {useEffect, useState} from "react";
import Home from "./Home";
import Thermostats from "./Thermostats";
import BackendService from "./service/BackendService";
import {Box, Button, LinearProgress, Typography} from "@material-ui/core";
import SimpleBottomNavigation from "./common/SimpleBottomNavigation";

const ReactRouter = (props: { backendService: BackendService }) => {
    const {backendService} = props;
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        backendService.isLoggedIn().subscribe((value) => {
            setIsLoggedIn(value);
        });
    });

    if (isLoggedIn == null) {
        return (<LinearProgress/>)
    }

    const _404 = (path: string) => (
        <Box m={16} textAlign='center'>
            <Typography variant="h1">404</Typography>
            <Typography variant="h5">Page not found</Typography>
            <Box m={2}>
                <Button color="primary" variant="contained" component={Link} to={path}>Go home</Button>
            </Box>
        </Box>
    );

    const publicPaths = () => (
        <Switch>
            <Route path="/verify"><Verify backendService={backendService}/></Route>
            <Route path="/login"><Login backendService={backendService}/></Route>
            <Route>{_404("/login")}</Route>
        </Switch>
    );

    const privatePaths = () => (
        <Box>
            <Switch>
                <Route path="/logout"><Logout backendService={backendService}/></Route>
                <Route path="/upload"><Upload backendService={backendService}/></Route>
                <Route path="/user"><User backendService={backendService}/></Route>
                <Route path="/power"><Power backendService={backendService}/></Route>
                <Route path="/archive"><Archive backendService={backendService}/></Route>
                <Route path="/consumers"><Consumers backendService={backendService}/></Route>
                <Route path="/behavior"><Behavior/></Route>
                <Route path="/thermostats"><Thermostats/></Route>
                <Route exact path="/"><Home/></Route>
                <Route exact path={`${process.env.PUBLIC_URL}`}><Home/></Route>
                <Route>{_404("/")}</Route>
            </Switch>
        </Box>
    );


    return (
        <React.Fragment>
            {!isLoggedIn && <Redirect to="/login"/>}
            {!isLoggedIn && publicPaths()}
            {isLoggedIn && privatePaths()}
            {isLoggedIn && (<SimpleBottomNavigation/>)}
        </React.Fragment>
    )
}

export default ReactRouter;
