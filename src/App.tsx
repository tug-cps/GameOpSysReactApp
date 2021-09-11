import React, {useMemo} from "react";
import {createTheme, CssBaseline, LinearProgress, ThemeOptions, ThemeProvider,} from "@material-ui/core";
import ReactRouter from "./Routes";
import BackendService from "./service/BackendService";
import Config from "./Config";
import {lightGreen} from "@material-ui/core/colors";
import {useTracking} from "react-tracking";

const backendService = new BackendService(Config.backend);

function dispatch(data: any): void {
    backendService.postTracking(data)
        .catch(console.log);
}

function App() {
    //Disabled, not supported for now
    //const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const theme: ThemeOptions = useMemo(() => createTheme({
        palette: {
            type: 'light',
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
    }), []);

    const {Track} = useTracking({}, {dispatch: dispatch});

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <React.Suspense fallback={<LinearProgress/>}>
                <Track>
                    <ReactRouter backendService={backendService}/>
                </Track>
            </React.Suspense>
        </ThemeProvider>
    );
}

export default App;
