import React from 'react';
import {
    Box,
    Button,
    Container,
    createStyles,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fab,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    Paper,
    TextField,
    Theme,
    WithStyles
} from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import {withStyles} from "@material-ui/core/styles";
import BackendService from "./service/BackendService";
import DefaultAppBar from "./common/DefaultAppBar";
import {ConsumerModel} from "./service/Model";
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

const styles = (theme: Theme) => createStyles({
    secondaryAction: {}
});


interface Props extends WithStyles<typeof styles> {
    backendService: BackendService
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
        const {backendService} = this.props;
        backendService.getConsumers()
            .then((consumers) => this.setState({consumers: consumers}))
            .catch((reason) => {
                console.log(reason)
            })
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
            const {selectedConsumer, consumerName} = this.state;
            const {backendService} = this.props;
            if (selectedConsumer != null) {
                backendService.putConsumer({...selectedConsumer, name: consumerName})
                    .then(this.refresh);
                handleClose();
            }
        }

        const handleChangeActive = (consumer: ConsumerModel) => {
            const {backendService} = this.props;
            backendService.putConsumer({...consumer, active: !consumer.active})
                .then(this.refresh)
                .catch(console.log)
        }

        const handleDelete = (consumer: ConsumerModel) => {
            const {backendService} = this.props;
            backendService.removeConsumer(consumer.consumerId)
                .then(this.refresh)
                .catch(console.log)
        }

        const ConsumerCard = (consumer: ConsumerModel) => {
            return (
                <ListItem key={consumer.consumerId} role={undefined} button onClick={() => handleClickOpen(consumer)}>
                    <ListItemText primary={consumer.name}/>
                    <ListItemSecondaryAction>
                        <IconButton
                            edge="end"
                            arial-label="show or hide"
                            onClick={() => handleChangeActive(consumer)}
                            className={classes.secondaryAction}>
                            {consumer.active ? <VisibilityIcon/> : <VisibilityOffIcon/>}
                        </IconButton>
                        <IconButton
                            edge="end"
                            arial-label="delete"
                            onClick={() => handleDelete(consumer)}
                            className={classes.secondaryAction}>
                            <DeleteIcon/>
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            )
        };

        const {consumers, open, consumerName} = this.state;
        return (
            <React.Fragment>
                <DefaultAppBar title='Consumers'/>
                <Container maxWidth="sm" disableGutters>
                    <Box my={1}>
                        <Paper variant="outlined">
                            <List>{consumers.map(ConsumerCard)}</List>
                        </Paper>
                    </Box>
                </Container>
                <Fab color="primary" aria-label="add"><AddIcon/></Fab>
                <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Change consumer</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Consumer name"
                            fullWidth
                            value={consumerName}
                            onChange={(e) => this.setState({consumerName: e.target.value})}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">Cancel</Button>
                        <Button onClick={handleChangeName} color="primary">Rename</Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(Consumers);
