import React from "react";
import {CssBaseline, LinearProgress, ThemeProvider, Typography,} from "@material-ui/core";
import {createMuiTheme} from "@material-ui/core/styles";
import ReactRouter from "./Routes";
import BackendService from "./service/BackendService";
import Config from "./Config";

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

const backendService = new BackendService(Config.backend);

class App extends React.Component {
    render() {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <React.Suspense fallback={<LinearProgress/>}>
                    <ReactRouter backendService={backendService}/>
                </React.Suspense>
                {Config.type !== "production" &&
                <Typography component="h5" style={{position: "fixed", bottom: 0}}>
                    {Config.type} build, using {Config.apiDescription}
                </Typography>
                }
            </ThemeProvider>
        );
    }
}

export default App;
