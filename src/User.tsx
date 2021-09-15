import React, {useEffect, useState} from 'react';
import {
    Box,
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
} from "@material-ui/core";
import {Link as RouterLink, useHistory} from "react-router-dom";
import {ArrowRight, Email, ExitToApp, InfoOutlined, Language, MyLocation, Power} from "@material-ui/icons";
import i18next from "i18next";
import {useTranslation, withTranslation, WithTranslation} from "react-i18next";
import DefaultAppBar from "./common/DefaultAppBar";
import BackendService from "./service/BackendService";
import {AlertSnackbar} from "./common/AlertSnackbar";
import {useSnackBar} from "./common/UseSnackBar";
import {UserModel} from "./service/Model";
import useDefaultTracking from "./common/Tracking";
import {InfoDialog, Lorem, useInfoDialog} from "./common/InfoDialog";
import {ResponsiveIconButton} from "./common/ResponsiveIconButton";

interface Props extends WithTranslation {
    backendService: BackendService
}

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

function User(props: Props) {
    const {Track} = useDefaultTracking({page: 'User'});
    const [infoProps, openInfo] = useInfoDialog();
    const [language, setLanguage] = useState<string>(i18next.languages[0]);
    const [user, setUser] = useState<UserModel>()
    const [consumers, setConsumers] = useState<number>();
    const [error, setError] = useSnackBar();
    const history = useHistory();

    const {backendService, t} = props;

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

    return (
        <Track>
            <DefaultAppBar hideBackButton title={t('card_user_title')}>
                <ResponsiveIconButton description={t('info')} icon={<InfoOutlined/>} onClick={openInfo}/>
                <ResponsiveIconButton
                    icon={<ExitToApp/>}
                    onClick={() => history.push('/logout')}
                    description={t('logout')}
                />
            </DefaultAppBar>
            {user &&
            <Box py={1}>
                <Container maxWidth="sm" disableGutters>
                    <Paper variant="outlined">
                        <List>
                            <UserInfo user={user}/>
                            <Divider variant="inset" component="li"/>
                            {user.type !== "management" && <ConsumersInfo consumers={consumers}/>}
                            <LanguageInfo language={language} changeLanguage={changeLanguage}/>
                        </List>
                    </Paper>
                    {process.env.REACT_APP_BUILD_SHA && <Typography>{process.env.REACT_APP_BUILD_SHA}</Typography>}
                </Container>
            </Box>
            }
            {!user && <LinearProgress/>}
            <InfoDialog title={t('info')} content={<Lorem/>} {...infoProps}/>
            <AlertSnackbar {...error}/>
        </Track>
    )
}

export default withTranslation()(User);
