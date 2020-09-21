import React from 'react';
import {
    AppBar,
    Button,
    Container,
    createStyles,
    CssBaseline,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    TextField,
    Theme,
    Toolbar,
    Typography,
    WithStyles
} from "@material-ui/core";
import {RouteComponentProps} from 'react-router-dom';
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import {withStyles} from "@material-ui/core/styles";
import {apiClient, ConsumerModel} from "./ApiClient";

const styles = (theme: Theme) => createStyles({
    card: {
        borderColor: theme.palette.secondary.main,
    },
    list: {
        backgroundColor: theme.palette.background.paper,
    },
    media: {
        minHeight: 120,
        backgroundColor: theme.palette.secondary.main,
    },
    largeIcon: {
        fontSize: "8em",
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
});


interface Props extends WithStyles<typeof styles>, RouteComponentProps {
}

interface State {
    consumers: ConsumerModel[]
    open: boolean
    consumerName: string
    selectedConsumer?: ConsumerModel
}

class Consumers extends React.Component<Props, State> {

    constructor(props: Readonly<Props>) {
        super(props);
        this.state = {
            consumers: [],
            open: false,
            consumerName: ""
        }

        this.refresh = this.refresh.bind(this);
    }

    refresh() {
        apiClient.getConsumers().then((consumers) => this.setState({consumers: consumers}))
    }

    componentDidMount() {
        this.refresh()
    }

    render() {
        const {classes} = this.props;

        const handleClickOpen = (consumer: ConsumerModel) => {
            this.setState({consumerName: consumer.name, selectedConsumer: consumer, open: true})
        };

        const handleClose = () => {
            this.setState({open: false})
        };

        const handleChangeName = () => {
            const consumer = this.state.selectedConsumer;
            if (consumer != null) {
                apiClient.putConsumer({...consumer, name: this.state.consumerName}).then(this.refresh);
                handleClose();
            }
        }

        const handleChangeActive = (consumer: ConsumerModel) => {
            apiClient.putConsumer({...consumer, active: !consumer.active}).then(this.refresh);
        }

        const ConsumerCard = (consumer: ConsumerModel) => {
            return (
                <ListItem key={consumer.consumerId} role={undefined} button onClick={() => handleClickOpen(consumer)}>
                    <ListItemText primary={consumer.name}/>
                    <ListItemSecondaryAction onClick={() => handleChangeActive(consumer)}>
                        <IconButton edge="end" arial-label="show or hide">
                            {consumer.active ? <VisibilityIcon/> : <VisibilityOffIcon/>}
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            )
        };

        return (
            <React.Fragment>
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
                        <Typography variant="h6" className={classes.title}>Consumers</Typography>
                    </Toolbar>
                </AppBar>
                <Container maxWidth="sm" disableGutters>
                    <CssBaseline/>
                    <List className={classes.list}>
                        {this.state.consumers.map(ConsumerCard)}
                    </List>
                </Container>
                <Dialog open={this.state.open} onClose={handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Change consumer</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Consumer name"
                            fullWidth
                            value={this.state.consumerName}
                            onChange={(e) => this.setState({consumerName: e.target.value})}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleChangeName} color="primary">
                            Rename
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(Consumers);
