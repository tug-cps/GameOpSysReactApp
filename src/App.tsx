import React from "react";
import {createTheme, CssBaseline, LinearProgress, ThemeOptions, ThemeProvider,} from "@material-ui/core";
import ReactRouter from "./Routes";
import BackendService from "./service/BackendService";
import Config from "./Config";
import {lightGreen} from "@material-ui/core/colors";

const theme: ThemeOptions = createTheme({
    palette: {
        primary: {
            main: lightGreen[600],
            contrastText: '#fff'
        },
        secondary: {
            main: lightGreen[400]
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
