import React from 'react';
import {
    AppBar,
    Container,
    createStyles,
    Fab,
    Icon,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Theme,
    Toolbar,
    Typography,
    WithStyles
} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {RouteComponentProps, Link as RouterLink} from "react-router-dom";
import {apiClient, UserModel} from "./ApiClient";

const styles = ({palette, spacing}: Theme) => createStyles({
    root: {
        flexGrow: 1,
    },
    fab: {
        position: 'absolute',
        bottom: spacing(2),
        right: spacing(2),
    },
    extendedIcon: {
        marginRight: spacing(1),
    },
    menuButton: {
        marginRight: spacing(2),
    },
    title: {
        flexGrow: 1,
    },
});

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
}

interface State {
    user: UserModel;
    consumersCount: number;
}

class User extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            user: {
                userId: '',
                email: '',
                type: '',
                creationDate: '',
                unlockDate: '',
                treatmentGroup: ''
            },
            consumersCount: 0
        };
    }

    componentDidMount() {
        apiClient.getUser().then((user) => this.setState({user: user}));
        apiClient.getConsumers().then((consumers) => this.setState({consumersCount: consumers.length}))
    }

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <AppBar position="sticky">
                    <Toolbar>
                        <IconButton
                            edge="start"
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="back"
                            onClick={() => this.props.history.go(-1)}
                        >
                            <ArrowBackIcon/>
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>User</Typography>
                    </Toolbar>
                </AppBar>
                <Container maxWidth="md">
                    <List>
                        <ListItem>
                            <ListItemIcon><Icon>email</Icon></ListItemIcon>
                            <ListItemText>{this.state.user.email}</ListItemText>
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><Icon>power</Icon></ListItemIcon>
                            <ListItemText>{this.state.consumersCount} consumers</ListItemText>
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><Icon>group</Icon></ListItemIcon>
                            <ListItemText>{this.state.user.treatmentGroup}</ListItemText>
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><Icon>access_time</Icon></ListItemIcon>
                            <ListItemText>Created at {this.state.user.creationDate}</ListItemText>
                        </ListItem>
                        <ListItem>
                            <ListItemIcon/>
                            <ListItemText>Unlocked at {this.state.user.unlockDate}</ListItemText>
                        </ListItem>
                        <ListItem>
                            <ListItemIcon/>
                            <ListItemText>Finished at</ListItemText>
                        </ListItem>
                    </List>
                </Container>
                <Fab variant="extended" color="primary" className={classes.fab} component={RouterLink} to="/consumers">
                    <Icon className={classes.extendedIcon}>edit</Icon>
                    Edit consumers
                </Fab>
            </div>
        )
    }
}

export default withStyles(styles)(User);
