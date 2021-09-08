import React, {useMemo} from "react";
import {createTheme, CssBaseline, LinearProgress, ThemeOptions, ThemeProvider, useMediaQuery,} from "@material-ui/core";
import ReactRouter from "./Routes";
import BackendService from "./service/BackendService";
import Config from "./Config";
import {lightGreen} from "@material-ui/core/colors";

const backendService = new BackendService(Config.backend);

function App() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const theme: ThemeOptions = useMemo(() => createTheme({
        palette: {
            type: prefersDarkMode ? 'dark' : 'light',
            primary: {
                main: lightGreen[600],
                contrastText: '#fff'
            },
            secondary: {
                main: lightGreen[400]
            },
        },
        props: {
            MuiGrid: {
                spacing: 1
            },
            MuiCard: {
                variant: "outlined"
            },
        },
        overrides: {
            MuiFab: {
                root: {
                    position: 'fixed',
                    bottom: '10px',
                    right: '10px',
                    // When bottom bar is shown, raise FAB position
                    '@media (max-width:599.95px)': {
                        bottom: '70px'
                    }
                }
            },
            MuiSnackbar: {
                anchorOriginBottomCenter: {
                    // When bottom bar is shown, raise Snackbar position
                    '@media (max-width:599.95px)': {
                        bottom: '70px'
                    }
                }
            }
        },
    }), [prefersDarkMode]);


    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <React.Suspense fallback={<LinearProgress/>}>
                <ReactRouter backendService={backendService}/>
            </React.Suspense>
        </ThemeProvider>
    );
}

export default App;
