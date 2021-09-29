import {LocalizationProvider} from "@mui/lab";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import {CssBaseline, LinearProgress, StyledEngineProvider, ThemeProvider,} from "@mui/material";
import React, {useCallback, useEffect, useState} from "react";
import {useTracking} from "react-tracking";
import DefaultAppBar, {Content, DefaultDrawer, Root} from "./common/DefaultAppBar";
import DefaultBottomNavigation from "./common/DefaultBottomNavigation";
import Config from "./Config";
import {PrivateRouter, PublicRouter} from "./Routes";
import BackendService from "./service/BackendService";
import {UserModel} from "./service/Model";
import {BrowserRouter as Router} from 'react-router-dom';
import {UserConfirmationDialog, useUserConfirmationDialog} from "./common/UserConfirmationDialog";
import {useThemeBuilder} from "./common/UseThemeBuilder";

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
    const dispatchTracking = useCallback((data: any) => backendService.postTracking(data).catch(console.log), [])
    const {Track} = useTracking({}, {dispatch: dispatchTracking});

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
                            <UserConfirmationDialog {...userConfirmationProps}/>
                        </Router>
                    </ColorModeContext.Provider>
                </React.Suspense>
                }
            </ThemeProvider>
        </StyledEngineProvider>
    );
}

export default App;
