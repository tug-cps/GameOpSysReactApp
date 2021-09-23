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
import {
    Container,
    Divider,
    LinearProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Paper,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from "@mui/material";
import i18next from "i18next";
import React, {useContext, useEffect, useState} from 'react';
import {useTranslation, withTranslation, WithTranslation} from "react-i18next";
import {Link as RouterLink, useHistory} from "react-router-dom";
import {AppBarProps, ColorMode, ColorModeContext} from "./App";
import {AlertSnackbar} from "./common/AlertSnackbar";
import {InfoDialog, Lorem, useInfoDialog} from "./common/InfoDialog";
import {ResponsiveIconButton} from "./common/ResponsiveIconButton";
import useDefaultTracking from "./common/Tracking";
import {useSnackBar} from "./common/UseSnackBar";
import BackendService from "./service/BackendService";
import {UserModel} from "./service/Model";

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

function LanguageInfo(props: { language: string, changeLanguage: (language: string) => void }) {
    const {t} = useTranslation();
    return <ListItem key="element_language">
        <ListItemIcon><Language/></ListItemIcon>
        <TextField
            label={t("language")}
            select
            variant="outlined"
            fullWidth
            value={props.language}
            onChange={(e) => props.changeLanguage(e.target.value)}
        >
            <MenuItem value={"de"}>{t('lang_german')}</MenuItem>
            <MenuItem value={"en"}>{t('lang_english')}</MenuItem>
        </TextField>
    </ListItem>
}

interface Props extends WithTranslation {
    backendService: BackendService
    setAppBar: (props: AppBarProps) => void
}

function User(props: Props) {
    const {Track} = useDefaultTracking({page: 'User'});
    const [infoProps, openInfo] = useInfoDialog();
    const [language, setLanguage] = useState<string>(i18next.languages[0]);
    const [user, setUser] = useState<UserModel>()
    const [error, setError] = useSnackBar();
    const history = useHistory();
    const colorMode = useContext(ColorModeContext);
    const colorModeValue = colorMode.mode ?? 'auto';

    const {backendService, t, setAppBar} = props;

    useEffect(() => {
        backendService.getUser()
            .then(setUser, setError)
            .catch(console.log)
    }, [backendService, setError])

    const changeLanguage = (language: string) =>
        i18next.changeLanguage(language)
            .then(() => setLanguage(language), setError)
            .catch(console.log)

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

    const setColorMode = (event: React.MouseEvent<HTMLElement>, value: string | null) => {
        if (value !== null) {
            colorMode.toggleColorMode((value !== 'auto' ? value : undefined) as ColorMode)
        }
    }

    return (
        <Track>
            {user &&
            <Container maxWidth="sm">
                <Paper variant="outlined" square>
                    <List>
                        <UserInfo user={user}/>
                        <Divider variant="inset" component="li"/>
                        {user.type !== "management" && <ConsumersInfo/>}
                        <LanguageInfo language={language} changeLanguage={changeLanguage}/>
                        <ListItem>
                            <ListItemIcon><Brightness4Outlined/></ListItemIcon>
                            <ToggleButtonGroup
                                fullWidth
                                color="primary"
                                value={colorModeValue}
                                exclusive
                                onChange={setColorMode}
                            >
                                <ToggleButton value="auto">Auto</ToggleButton>
                                <ToggleButton value="light">Light</ToggleButton>
                                <ToggleButton value="dark">Dark</ToggleButton>
                            </ToggleButtonGroup>
                        </ListItem>

                    </List>
                </Paper>
                {process.env.REACT_APP_BUILD_SHA && <Typography>{process.env.REACT_APP_BUILD_SHA}</Typography>}
            </Container>
            }
            {!user && <LinearProgress/>}
            <InfoDialog title={t('info')} content={<Lorem/>} {...infoProps}/>
            <AlertSnackbar {...error}/>
        </Track>
    )
}

export default withTranslation()(User);
