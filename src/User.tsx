import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
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
import {Link as RouterLink} from "react-router-dom";
import {ArrowRight, Email, ExitToApp, Group, Language, MyLocation, Power} from "@material-ui/icons";
import i18next from "i18next";
import {useTranslation, withTranslation, WithTranslation} from "react-i18next";
import DefaultAppBar from "./common/DefaultAppBar";
import BackendService from "./service/BackendService";
import {AlertSnackbar} from "./common/AlertSnackbar";
import {useSnackBar} from "./common/UseSnackBar";
import {UserModel} from "./service/Model";
import useDefaultTracking from "./common/Tracking";

interface Props extends WithTranslation {
    backendService: BackendService
}

function UserInfo(props: { user: UserModel }) {
    const {user} = props;
    const items = [
        {icon: <Email/>, text: user.email},
        {icon: <MyLocation/>, text: user.location},
        {icon: <Group/>, text: user.type},
    ]
    return <>{items.map((it, idx) =>
        <ListItem key={'element_' + idx}>
            <ListItemIcon>{it.icon}</ListItemIcon>
            <ListItemText>{it.text}</ListItemText>
        </ListItem>
    )}</>
}

function ConsumersInfo(props: { consumers?: number }) {
    const {t} = useTranslation()
    return <ListItem key={'element_consumers'} button component={RouterLink} to={"/consumers"}>
        <ListItemIcon><Power/></ListItemIcon>
        <ListItemText>{t('user_consumer', {count: props.consumers})}</ListItemText>
        <ListItemIcon><ArrowRight/></ListItemIcon>
    </ListItem>
}

function LanguageInfo(props: { language: string, changeLanguage: (language: string) => void }) {
    return <ListItem key="element_language">
        <ListItemIcon><Language/></ListItemIcon>
        <TextField
            label="Language"
            select
            variant="outlined"
            fullWidth
            value={props.language}
            onChange={(e) => props.changeLanguage(e.target.value)}
        >
            <MenuItem value={"de"}>German</MenuItem>
            <MenuItem value={"en"}>English</MenuItem>
        </TextField>
    </ListItem>
}

function User(props: Props) {
    const {Track} = useDefaultTracking({page: 'User'});
    const [language, setLanguage] = useState<string>(i18next.languages[0]);
    const [user, setUser] = useState<UserModel>()
    const [consumers, setConsumers] = useState<number>();
    const [error, setError] = useSnackBar();

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
                <Button
                    startIcon={<ExitToApp/>}
                    color="inherit"
                    component={RouterLink}
                    to="/logout"
                >{t('logout')}</Button>
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
            <AlertSnackbar {...error}/>
        </Track>
    )
}

export default withTranslation()(User);
