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
import DefaultBottomNavigation from "./common/DefaultBottomNavigation";
import Mood from "./Mood";
import {UserModel} from "./service/Model";

export const UserContext = React.createContext<UserModel | undefined>(undefined);

const ReactRouter = (props: { backendService: BackendService }) => {
    const {backendService} = props;
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>();
    const [user, setUser] = useState<UserModel>();

    useEffect(() => {
        backendService.isLoggedIn().subscribe((value) => setIsLoggedIn(value));
    }, [backendService]);

    useEffect(() => {
        if (!isLoggedIn) {
            setUser(undefined);
        } else {
            backendService.getUser()
                .then(setUser)
                .catch(console.error);
        }
    }, [isLoggedIn, backendService])

    if (isLoggedIn == null) return (<LinearProgress/>)

    const Page404 = (props: { path: string }) => (
        <Box m={16} textAlign='center'>
            <Typography variant="h1">404</Typography>
            <Typography variant="h5">Page not found</Typography>
            <Box m={2}>
                <Button color="primary" variant="contained" component={Link} to={props.path}>Go home</Button>
            </Box>
        </Box>
    );

    const PublicPaths = () => (
        <Switch>
            <Route path="/verify"><Verify backendService={backendService}/></Route>
            <Route path="/login"><Login backendService={backendService}/></Route>
            <Route><Page404 path="/login"/></Route>
        </Switch>
    );

    const PrivatePaths = (props: { user: UserModel }) => {
        const paths = {
            logout: <Route path="/logout"><Logout backendService={backendService}/></Route>,
            upload: <Route path="/upload"><Upload backendService={backendService}/></Route>,
            user: <Route path="/user"><User backendService={backendService}/></Route>,
            power: <Route path="/power"><Power backendService={backendService}/></Route>,
            archive: <Route path="/archive"><Archive backendService={backendService}/></Route>,
            consumers: <Route path="/consumers"><Consumers backendService={backendService}/></Route>,
            behavior: <Route path="/behavior"><Behavior backendService={backendService}/></Route>,
            mood: <Route path="/mood"><Mood backendService={backendService}/></Route>,
            thermostats: <Route path="/thermostats"><Thermostats/></Route>
        }

        const managementPaths = () => ([paths.upload]);
        const homeOwnerPaths = () => ([
            paths.upload,
            paths.power,
            paths.consumers,
            paths.behavior,
            paths.thermostats,
            paths.mood
        ]);

        const studentPaths = () => ([
            paths.archive,
            paths.consumers,
            paths.behavior,
            paths.mood
        ]);

        const {user} = props;
        return (<Switch>
            {user.type === "management" && managementPaths()}
            {user.type === "student" && studentPaths()}
            {user.type === "homeowner" && homeOwnerPaths()}
            <Route path="/logout"><Logout backendService={backendService}/></Route>,
            <Route path="/user"><User backendService={backendService}/></Route>,
            <Route exact path="/"><Home/></Route>
            <Route exact path={`${process.env.PUBLIC_URL}`}><Home/></Route>
            <Route><Page404 path="/"/></Route>
        </Switch>);
    }


    return (
        <UserContext.Provider value={user}>
            {!isLoggedIn && <Redirect to="/login"/>}
            {!isLoggedIn && <PublicPaths/>}
            {user && <PrivatePaths user={user}/>}
            {isLoggedIn && (<DefaultBottomNavigation/>)}
        </UserContext.Provider>
    )
}

export default ReactRouter;
