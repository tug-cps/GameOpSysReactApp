import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';

import './index.css';
import App from "./App";
import Login from "./Login";
import Logout from "./Logout"
import PrivateRoute from "./common/PrivateRoute";
import Upload from "./Upload";
import User from "./User";
import Survey from "./Survey";
import Verify from "./Verify";
import Power from "./Power";
import Archive from "./Archive";
import Consumers from "./Consumers";
import Behavior from "./Behavior";
import {Typography} from "@material-ui/core";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#7cb342',
            light: '#aee571',
            dark: '#4b830d',
            contrastText: '#fff'
        },
        secondary: {
            main: '#9ccc65',
            light: '#cfff95',
            dark: '#6b9b37'
        },
    },
});

ReactDOM.render((
        <React.StrictMode>
            <ThemeProvider theme={theme}>
                <Router basename={process.env.PUBLIC_URL}>
                    <Switch>
                        <PrivateRoute path="/" exact component={App}/>
                        <Route path="/login" component={Login}/>
                        <Route path="/verify" component={Verify}/>
                        <PrivateRoute path="/logout" component={Logout}/>
                        <PrivateRoute path="/upload" component={Upload}/>
                        <PrivateRoute path="/user" component={User}/>
                        <PrivateRoute path="/survey" component={Survey}/>
                        <PrivateRoute path="/power" component={Power}/>
                        <PrivateRoute path="/archive" component={Archive}/>
                        <PrivateRoute path="/consumers" component={Consumers}/>
                        <PrivateRoute path="/behavior" component={Behavior}/>
                        <Route component={() => (<div>404 Not found</div>)}/>
                    </Switch>
                </Router>
                {process.env.NODE_ENV !== "production" &&
                <Typography component="h5" style={{position: "fixed", bottom: 0}}>
                    {process.env.NODE_ENV} build using api {process.env.REACT_APP_API_BASE_URL}
                </Typography>
                }
            </ThemeProvider>
        </React.StrictMode>
    ), document.getElementById('root')
);
