import React from "react";
import {createTheme, CssBaseline, LinearProgress, ThemeProvider,} from "@material-ui/core";
import ReactRouter from "./Routes";
import BackendService from "./service/BackendService";
import Config from "./Config";

const theme = createTheme({
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
            </ThemeProvider>
        );
    }
}

export default App;
