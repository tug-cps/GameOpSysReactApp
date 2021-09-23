import React, {useEffect, useState} from 'react';
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
    Typography
} from "@mui/material";
import {Link as RouterLink, useHistory} from "react-router-dom";
import {ArrowRight, Email, ExitToApp, InfoOutlined, Language, MyLocation, Power} from "@mui/icons-material";
import i18next from "i18next";
import {useTranslation, withTranslation, WithTranslation} from "react-i18next";
import BackendService from "./service/BackendService";
import {AlertSnackbar} from "./common/AlertSnackbar";
import {useSnackBar} from "./common/UseSnackBar";
import {UserModel} from "./service/Model";
import useDefaultTracking from "./common/Tracking";
import {InfoDialog, Lorem, useInfoDialog} from "./common/InfoDialog";
import {ResponsiveIconButton} from "./common/ResponsiveIconButton";
import {AppBarProps} from "./App";

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

function ConsumersInfo(props: { consumers?: number }) {
    const {t} = useTranslation();
    return <ListItem key={'element_consumers'} button component={RouterLink} to={"/consumers"}>
        <ListItemIcon><Power/></ListItemIcon>
        <ListItemText>{t('user_consumer', {count: props.consumers})}</ListItemText>
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
    const [consumers, setConsumers] = useState<number>();
    const [error, setError] = useSnackBar();
    const history = useHistory();

    const {backendService, t, setAppBar} = props;

    useEffect(() => {
        backendService.getUser()
            .then(setUser, setError)
            .catch(console.log)
    }, [backendService, setError])

    useEffect(() => {
        backendService.getConsumers()
            .then(consumers => consumers?.length | 0)
            .then(setConsumers, setError)
            .catch(console.log);
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

    return (
        <Track>
            {user &&
            <Container maxWidth="sm">
                <Paper variant="outlined" square>
                    <List>
                        <UserInfo user={user}/>
                        <Divider variant="inset" component="li"/>
                        {user.type !== "management" && <ConsumersInfo consumers={consumers}/>}
                        <LanguageInfo language={language} changeLanguage={changeLanguage}/>
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
