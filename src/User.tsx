import React, {useEffect, useState} from 'react';
import {
    Button,
    Container,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    MenuItem,
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
import PowerIcon from '@material-ui/icons/Power';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import LanguageIcon from '@material-ui/icons/Language';
import {AlertSnackbar} from "./common/AlertSnackbar";
import {useSnackBar} from "./common/UseSnackBar";
import {MyLocation} from "@material-ui/icons";
import {UserModel} from "./service/Model";

interface Props extends WithTranslation {
    backendService: BackendService
}

interface State extends UserModel {
    consumersCount: number
    language: string
}

function User(props: Props) {
    const [state, setState] = useState<State>({
        userId: '',
        email: '',
        location: '',
        type: '',
        consumersCount: 0,
        language: i18n.languages[0]
    });

    const [error, setError] = useSnackBar();
    const {backendService, t} = props;

    useEffect(() => {
        Promise.all([backendService.getUser(), backendService.getConsumers()])
            .then(([user, consumers]) =>
                setState(prevState => ({...prevState, ...user, consumersCount: consumers.length})), setError)
            .catch(console.log)
    }, [backendService, setError])

    const changeLanguage = (event: React.ChangeEvent<{ value: unknown }>) => {
        i18n.changeLanguage(event.target.value as string).then(() => {
            setState({...state, language: event.target.value as string});
        })
    };

    const items = [
        {icon: <EmailIcon/>, text: state.email},
        {icon: <MyLocation/>, text: state.location},
        {icon: <GroupIcon/>, text: state.type},
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
                                <ListItemIcon>{it.icon}</ListItemIcon>
                                <ListItemText>{it.text}</ListItemText>
                            </ListItem>
                        )
                    })}
                    <Divider/>
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
