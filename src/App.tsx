import {LocalizationProvider} from "@mui/lab";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import {
    createTheme,
    CssBaseline,
    LinearProgress,
    StyledEngineProvider,
    ThemeOptions,
    ThemeProvider,
} from "@mui/material";
import {lightGreen} from "@mui/material/colors";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useTracking} from "react-tracking";
import DefaultAppBar, {Content, DefaultDrawer, Root} from "./common/DefaultAppBar";
import DefaultBottomNavigation from "./common/DefaultBottomNavigation";
import Config from "./Config";
import {PrivateRouter, PublicRouter} from "./Routes";
import BackendService from "./service/BackendService";
import {UserModel} from "./service/Model";

const backendService = new BackendService(Config.backend);
export const UserContext = React.createContext<UserModel | undefined>(undefined);

export interface AppBarProps {
    title: string,
    showBackButton: boolean,
    children: () => JSX.Element
}

export interface PrivateRouteProps {
    backendService: BackendService,
    setAppBar: (props: AppBarProps) => void
}

function App() {
    //Disabled, not supported for now
    //const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const theme: ThemeOptions = useMemo(() => createTheme({
        palette: {
            mode: 'light',
            primary: {
                main: lightGreen[600],
                contrastText: '#fff'
            },
            secondary: {
                main: lightGreen[400]
            },
        },
        components: {
            MuiUseMediaQuery: {
                defaultProps: {
                    noSsr: true,
                }
            },
            MuiGrid: {
                defaultProps: {
                    spacing: 1
                }
            },
            MuiCard: {
                defaultProps: {
                    variant: "outlined",
                    square: true,
                }
            },
            MuiFab: {
                styleOverrides: {
                    root: {
                        position: 'fixed',
                        bottom: '10px',
                        right: '10px',
                        // When bottom bar is shown, raise FAB position
                        '@media (max-width:599.95px)': {
                            bottom: '70px'
                        }
                    }
                }
            },
            MuiSnackbar: {
                styleOverrides: {
                    anchorOriginBottomCenter: {
                        // When bottom bar is shown, raise Snackbar position
                        '@media (max-width:599.95px)': {
                            bottom: '70px'
                        }
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

    const [appBar, setAppBar] = useState<AppBarProps>({
        title: "",
        showBackButton: false,
        children: () => <></>
    });
    const setAppBarCb = useCallback((props: AppBarProps) => setAppBar(props), [])

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                {isLoggedIn !== undefined &&
                <React.Suspense fallback={<LinearProgress/>}>
                    {!isLoggedIn &&
                    <PublicRouter backendService={backendService}/>
                    }
                    {isLoggedIn &&
                    <UserContext.Provider value={user}>
                        <Track>
                            <Root>
                                <DefaultAppBar title={appBar.title}
                                               hideBackButton={!appBar.showBackButton}
                                               children={appBar.children()}/>
                                <DefaultDrawer/>
                                <Content>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <PrivateRouter
                                            backendService={backendService}
                                            setAppBar={setAppBarCb}
                                        />
                                    </LocalizationProvider>
                                </Content>
                            </Root>
                            <DefaultBottomNavigation/>
                        </Track>
                    </UserContext.Provider>
                    }
                </React.Suspense>
                }
            </ThemeProvider>
        </StyledEngineProvider>
    );
}

export default App;
