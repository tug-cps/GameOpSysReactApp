import {
    Container,
    DialogContentText,
    Divider,
    LinearProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from "@mui/material";
import i18next from "i18next";
import React, {useContext, useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {Link as RouterLink, useHistory} from "react-router-dom";
import {AppBarProps, ColorMode, ColorModeContext} from "./App";
import {AlertSnackbar} from "./common/AlertSnackbar";
import {InfoDialog, useInfoDialog} from "./common/InfoDialog";
import {ResponsiveIconButton} from "./common/ResponsiveIconButton";
import useDefaultTracking from "./common/Tracking";
import {useSnackBar} from "./common/UseSnackBar";
import BackendService from "./service/BackendService";
import {UserModel} from "./service/Model";
import {
    ArrowRight,
    Brightness4Outlined,
    Email,
    ExitToApp,
    InfoOutlined,
    Language,
    MyLocation,
    Power
} from "@mui/icons-material";

function UserInfo(props: { user: UserModel }) {
    const {user} = props;
    const items = [
        {icon: <Email/>, text: user.email},
        {icon: <MyLocation/>, text: user.location},
    ]
    return <>{items.map((it, idx) =>
        <ListItem key={'element_' + idx}>
            <ListItemIcon>{it.icon}</ListItemIcon>
            <ListItemText>{it.text}</ListItemText>
        </ListItem>
    )}</>
}

function ConsumersInfo(props: {}) {
    const {t} = useTranslation();
    return <ListItem key={'element_consumers'} button component={RouterLink} to={"/consumers"}>
        <ListItemIcon><Power/></ListItemIcon>
        <ListItemText>{t('user_consumer')}</ListItemText>
        <ListItemIcon><ArrowRight/></ListItemIcon>
    </ListItem>
}

function LanguageInfo(props: { setError: (description: string) => void }) {
    const {t} = useTranslation();
    const [language, setLanguage] = useState<string>(i18next.resolvedLanguage);
    const {setError} = props;

    const changeLanguage = React.useCallback((language: string) =>
            language && i18next.changeLanguage(language)
                .then(() => setLanguage(language), setError)
                .catch(console.log),
        [setError])
    return <>
        <ListItem key="element_language2">
            <ListItemIcon><Language/></ListItemIcon>
            <ToggleButtonGroup
                fullWidth
                color="primary"
                value={language}
                exclusive
                onChange={((event, value) => changeLanguage(value))}
            >
                <ToggleButton value="en">{t('lang_english')}</ToggleButton>
                <ToggleButton value="de">{t('lang_german')}</ToggleButton>
            </ToggleButtonGroup>
        </ListItem>
    </>
}

function ColorModeInfo(props: {}) {
    const colorMode = useContext(ColorModeContext);
    const colorModeValue = colorMode.mode ?? 'auto';
    const {t} = useTranslation();
    const setColorMode = (event: any, value: string | null): void => {
        value && colorMode.toggleColorMode((value !== 'auto' ? value : undefined) as ColorMode)
    }

    return (
        <ListItem key="element_color_mode">
            <ListItemIcon><Brightness4Outlined/></ListItemIcon>
            <ToggleButtonGroup
                fullWidth
                color="primary"
                value={colorModeValue}
                exclusive
                onChange={setColorMode}
            >
                <ToggleButton value="auto">Auto</ToggleButton>
                <ToggleButton value="light">{t('color_mode_light')}</ToggleButton>
                <ToggleButton value="dark">{t('color_mode_dark')}</ToggleButton>
            </ToggleButtonGroup>
        </ListItem>
    )
}

interface Props {
    backendService: BackendService
    setAppBar: (props: AppBarProps) => void
}

function User(props: Props) {
    const {Track} = useDefaultTracking({page: 'User'});
    const [infoProps, openInfo] = useInfoDialog();
    const [user, setUser] = useState<UserModel>()
    const [error, setError] = useSnackBar();
    const history = useHistory();
    const {t} = useTranslation();
    const {backendService, setAppBar} = props;

    useEffect(() => {
        backendService.getUser()
            .then(setUser, setError)
            .catch(console.log)
    }, [backendService, setError])

    useEffect(() => {
        setAppBar({
            title: t('card_user_title'),
            showBackButton: false,
            children: () =>
                <>
                    <ResponsiveIconButton description={t('info')} icon={<InfoOutlined/>} onClick={openInfo}/>
                    <ResponsiveIconButton
                        icon={<ExitToApp/>}
                        onClick={() => history.push('/logout')}
                        description={t('logout')}
                    />
                </>
        })
    }, [history, openInfo, t, setAppBar])

    return (
        <Track>
            {user &&
            <Container maxWidth="sm" sx={{paddingTop: 1}}>
                <Paper variant="outlined" square>
                    <List>
                        <UserInfo user={user}/>
                        <Divider variant="inset" component="li"/>
                        {user.type !== "management" && <ConsumersInfo/>}
                        <LanguageInfo setError={setError}/>
                        <ColorModeInfo/>
                    </List>
                </Paper>
                {process.env.REACT_APP_BUILD_SHA && <Typography>{process.env.REACT_APP_BUILD_SHA}</Typography>}
            </Container>
            }
            {!user && <LinearProgress/>}
            <InfoDialog title={t('info')} content={<DialogContentText children={t('info_settings')}/>} {...infoProps}/>
            <AlertSnackbar {...error}/>
        </Track>
    )
}

export default User;
