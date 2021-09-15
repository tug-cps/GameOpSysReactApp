import React, {useEffect, useMemo, useState} from "react";
import {createTheme, CssBaseline, LinearProgress, ThemeOptions, ThemeProvider,} from "@material-ui/core";
import ReactRouter from "./Routes";
import BackendService from "./service/BackendService";
import Config from "./Config";
import {lightGreen} from "@material-ui/core/colors";
import {useTracking} from "react-tracking";
import {UserModel} from "./service/Model";

const backendService = new BackendService(Config.backend);
export const UserContext = React.createContext<UserModel | undefined>(undefined);

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
            MuiUseMediaQuery: {
              noSsr: true,
            },
            MuiGrid: {
                spacing: 1
            },
            MuiCard: {
                variant: "outlined",
                square: true,
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
    const [user, setUser] = useState<UserModel>();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>();
    const {Track} = useTracking({}, {
        dispatch(data: any) {
            backendService.postTracking(data)
                .catch(console.log);
        }
    });

    useEffect(() => {
        backendService.isLoggedIn()
            .subscribe((value) => setIsLoggedIn(value));
    }, []);

    useEffect(() => {
        if (!isLoggedIn) {
            setUser(undefined);
        } else {
            backendService.getUser()
                .then(setUser)
                .catch(console.error);
        }
    }, [isLoggedIn])

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <React.Suspense fallback={<LinearProgress/>}>
                {isLoggedIn !== undefined &&
                <UserContext.Provider value={user}>
                    <Track>
                        <ReactRouter backendService={backendService} isLoggedIn={isLoggedIn}/>
                    </Track>
                </UserContext.Provider>
                }
            </React.Suspense>
        </ThemeProvider>
    );
}

export default App;
