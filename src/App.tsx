import {LocalizationProvider} from "@mui/lab";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import {CssBaseline, LinearProgress, StyledEngineProvider, ThemeProvider,} from "@mui/material";
import React, {useCallback, useEffect, useState} from "react";
import {BrowserRouter as Router} from 'react-router-dom';
import {useTracking} from "react-tracking";
import {AlertSnackbar} from "./common/AlertSnackbar";
import {Content, DefaultAppBar, DefaultDrawer, Root} from "./common/DefaultAppBar";
import DefaultBottomNavigation from "./common/DefaultBottomNavigation";
import {UserConfirmationDialog, useUserConfirmationDialog} from "./common/UserConfirmationDialog";
import {useSnackBar} from "./common/UseSnackBar";
import {useThemeBuilder} from "./common/UseThemeBuilder";
import Config from "./Config";
import {LoadingRouter, PrivateRouter, PublicRouter} from "./Routes";
import BackendService from "./service/BackendService";
import {UserModel} from "./service/Model";

export type ColorMode = 'light' | 'dark' | undefined

interface ColorModeCtx {
    mode: ColorMode,
    toggleColorMode: (mode: ColorMode) => void
}

const backendService = new BackendService(Config.backend);
export const UserContext = React.createContext<UserModel | undefined>(undefined);
export const ColorModeContext = React.createContext<ColorModeCtx>({
    mode: undefined,
    toggleColorMode: (state: ColorMode) => {
    }
});

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
    const [theme, colorMode] = useThemeBuilder();
    const [user, setUser] = useState<UserModel>();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>();
    const [error, setError] = useSnackBar();
    const dispatchTracking = useCallback((data: any) => backendService.postTracking(data).catch(console.log), [])
    const {Track} = useTracking({}, {dispatch: dispatchTracking});

    useEffect(() => {
        backendService.isLoggedIn()
            .subscribe((value) => setIsLoggedIn(value));
    }, []);

    //FIXME fix retry
    useEffect(() => {
        console.log('sending get user to server...........')
        if (!isLoggedIn) {
            setUser(undefined);
        } else {
            backendService.getUser()
                .then(setUser, setError)
                .catch(console.error);
        }
    }, [isLoggedIn, setError])

    const [appBar, setAppBar] = useState<AppBarProps>({
        title: "",
        showBackButton: false,
        children: () => <></>
    });
    const setAppBarCb = useCallback((props: AppBarProps) => setAppBar(props), [])
    const [userConfirmationProps, userConfirm] = useUserConfirmationDialog();

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                {isLoggedIn !== undefined &&
                <React.Suspense fallback={<LinearProgress/>}>
                    <ColorModeContext.Provider value={colorMode}>
                        <Router basename={`${process.env.PUBLIC_URL}#`} getUserConfirmation={userConfirm}>
                            {!isLoggedIn &&
                            <PublicRouter backendService={backendService}/>
                            }
                            {isLoggedIn && user &&
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
                            {isLoggedIn && !user &&
                            <LoadingRouter backendService={backendService} setAppBar={() => undefined}/>
                            }
                            <UserConfirmationDialog {...userConfirmationProps}/>
                            <AlertSnackbar {...error} severity="error"/>
                        </Router>
                    </ColorModeContext.Provider>
                </React.Suspense>
                }
            </ThemeProvider>
        </StyledEngineProvider>
    );
}

export default App;
