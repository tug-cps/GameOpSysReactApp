import React, {useEffect, useState} from 'react';
import {
    Button,
    Container,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    MenuItem,
    SvgIcon,
    TextField,
    Typography
} from "@material-ui/core";
import {Link as RouterLink} from "react-router-dom";
import DefaultAppBar from "./common/DefaultAppBar";
import i18n from "i18next";
import BackendService from "./service/BackendService";
import {withTranslation, WithTranslation} from "react-i18next";

import EmailIcon from '@material-ui/icons/Email';
import GroupIcon from '@material-ui/icons/Group';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import PowerIcon from '@material-ui/icons/Power';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import LanguageIcon from '@material-ui/icons/Language';
import {AlertSnackbar} from "./common/AlertSnackbar";
import {useSnackBar} from "./common/UseSnackBar";

interface Props extends WithTranslation {
    backendService: BackendService
}

interface State {
    userId: string
    email: string
    type: string
    creationDate: string
    unlockDate: string
    treatmentGroup: string
    consumersCount: number
    language: string
}

function User(props: Props) {
    const [state, setState] = useState<State>({
        userId: '',
        email: '',
        type: '',
        creationDate: '',
        unlockDate: '',
        treatmentGroup: '',
        consumersCount: 0,
        language: i18n.languages[0]
    });

    const [error, setError] = useSnackBar();
    const {backendService, t} = props;

    useEffect(() => {
        backendService.getUser()
            .then((user) => setState(prevState => ({...prevState, ...user})))
            .catch(setError)
        backendService.getConsumers()
            .then((consumers) => setState(prevState => ({...prevState, consumersCount: consumers.length})))
            .catch(setError)
    }, [backendService, setError])

    const changeLanguage = (event: React.ChangeEvent<{ value: unknown }>) => {
        i18n.changeLanguage(event.target.value as string).then(() => {
            setState({...state, language: event.target.value as string});
        })
    };

    const items = [
        {icon: EmailIcon, text: state.email},
        {icon: GroupIcon, text: state.treatmentGroup},
        {icon: AccessTimeIcon, text: t('user_created', {text: state.creationDate})},
        {icon: null, text: t('user_unlocked', {text: state.unlockDate})}
    ]
    return (
        <React.Fragment>
            <DefaultAppBar hideBackButton title={t('card_user_title')}>
                <Button color="inherit" component={RouterLink} to="/logout">{t('logout')}</Button>
            </DefaultAppBar>
            <Container maxWidth="sm">
                <List>
                    {items.map((it) => {
                        return (
                            <ListItem>
                                <ListItemIcon>{it.icon ? <SvgIcon component={it.icon}/> : null}</ListItemIcon>
                                <ListItemText>{it.text}</ListItemText>
                            </ListItem>
                        )
                    })}
                    <ListItem/>
                    <ListItem button component={RouterLink} to={"/consumers"}>
                        <ListItemIcon><PowerIcon/></ListItemIcon>
                        <ListItemText>{t('user_consumer', {count: state.consumersCount})}</ListItemText>
                        <ListItemIcon><ArrowRightIcon/></ListItemIcon>
                    </ListItem>
                    <ListItem>
                        <ListItemIcon><LanguageIcon/></ListItemIcon>
                        <TextField
                            label="Language"
                            select
                            variant="outlined"
                            fullWidth
                            value={state.language}
                            onChange={changeLanguage}
                        >
                            <MenuItem value={"de"}>German</MenuItem>
                            <MenuItem value={"en"}>English</MenuItem>
                        </TextField>
                    </ListItem>
                </List>
                {process.env.REACT_APP_BUILD_SHA && <Typography>{process.env.REACT_APP_BUILD_SHA}</Typography>}
            </Container>
            <AlertSnackbar {...error}/>
        </React.Fragment>
    )
}

export default withTranslation()(User);
