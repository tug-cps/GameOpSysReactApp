import React from 'react';
import {
    Button,
    Container,
    FormControl,
    InputLabel,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Select,
    SvgIcon
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

class User extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            userId: '',
            email: '',
            type: '',
            creationDate: '',
            unlockDate: '',
            treatmentGroup: '',
            consumersCount: 0,
            language: i18n.language
        };
    }

    componentDidMount() {
        const {backendService} = this.props;
        backendService.getUser()
            .then((user) => this.setState(user))
            .catch((error) => console.log(error))
        backendService.getConsumers()
            .then((consumers) => this.setState({consumersCount: consumers.length}))
            .catch((error) => console.log(error))
    }

    render() {
        const {t} = this.props;
        const state = this.state;

        const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
            i18n.changeLanguage(event.target.value as string).then(() => {
                this.setState({language: event.target.value as string});
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
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Language</InputLabel>
                                <Select
                                    value={state.language}
                                    label="Language"
                                    onChange={handleChange}
                                >
                                    <MenuItem value={"de"}>German</MenuItem>
                                    <MenuItem value={"en"}>English</MenuItem>
                                </Select>
                            </FormControl>
                        </ListItem>
                    </List>
                </Container>
            </React.Fragment>
        )
    }
}

export default withTranslation()(User);
