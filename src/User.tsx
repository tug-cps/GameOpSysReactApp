import React from 'react';
import {
    Container,
    createStyles,
    Fab,
    FormControl,
    Icon,
    InputLabel,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Select,
    Theme,
    WithStyles
} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import {Link as RouterLink} from "react-router-dom";
import DefaultAppBar from "./common/DefaultAppBar";
import i18n from "i18next";
import BackendService from "./service/BackendService";
import {withTranslation, WithTranslation} from "react-i18next";

const styles = ({spacing}: Theme) => createStyles({
    fab: {
        position: 'absolute',
        bottom: spacing(2),
        right: spacing(2),
    },
    extendedIcon: {
        marginRight: spacing(1),
    },
});

interface Props extends WithStyles<typeof styles>, WithTranslation {
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
            .catch((error) => {
                console.log(error)
            })
        backendService.getConsumers()
            .then((consumers) => this.setState({consumersCount: consumers.length}))
            .catch((error) => {
                console.log(error)
            })
    }

    render() {
        const {classes, t} = this.props;
        const state = this.state;

        const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
            i18n.changeLanguage(event.target.value as string).then(() => {
                this.setState({language: event.target.value as string});
            })
        };
        return (
            <React.Fragment>
                <DefaultAppBar title={t('card_user_title')} />
                <Container maxWidth="sm">
                    <List>
                        <ListItem>
                            <ListItemIcon><Icon>email</Icon></ListItemIcon>
                            <ListItemText>{state.email}</ListItemText>
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><Icon>power</Icon></ListItemIcon>
                            <ListItemText>{state.consumersCount} consumers</ListItemText>
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><Icon>group</Icon></ListItemIcon>
                            <ListItemText>{state.treatmentGroup}</ListItemText>
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><Icon>access_time</Icon></ListItemIcon>
                            <ListItemText>Created at {state.creationDate}</ListItemText>
                        </ListItem>
                        <ListItem>
                            <ListItemIcon/>
                            <ListItemText>Unlocked at {state.unlockDate}</ListItemText>
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><Icon>language</Icon></ListItemIcon>
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
                <Fab variant="extended" color="primary" className={classes.fab} component={RouterLink} to="/consumers">
                    <Icon className={classes.extendedIcon}>edit</Icon>
                    {t('edit_consumers')}
                </Fab>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(withTranslation()(User));
