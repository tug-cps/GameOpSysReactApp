import React from 'react';
import {
    Box,
    Button,
    Container,
    createStyles,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
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

interface EditState {
    consumer: ConsumerModel
    consumerName: string
    open: boolean
}

interface CreateState {
    consumerName: string
    open: boolean
}

interface State {
    consumers?: ConsumerModel[]
    editState?: EditState,
    createState?: CreateState,
}

class Consumers extends React.Component<Props, State> {

    constructor(props: Readonly<Props>) {
        super(props);
        this.state = {}
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

    handleClickOpenEdit(consumer: ConsumerModel) {
        this.setState({
            editState: {
                consumer: consumer,
                consumerName: consumer.name,
                open: true
            }
        });
    }

    handleCloseEdit() {
        this.setState({editState: {...this.state.editState!, open: false}});
    }

    handleClickOpenCreate() {
        this.setState({
            createState: {
                consumerName: "",
                open: true
            }
        });
    }

    handleCloseCreate() {
        this.setState({createState: {...this.state.createState!, open: false}});
    }

    applyEditConsumer() {
        const {consumer, consumerName} = this.state.editState!;
        const {backendService} = this.props;
        backendService.putConsumer({...consumer, name: consumerName})
            .then(this.refresh)
            .catch(console.log);
        this.handleCloseEdit();
    }

    applyCreateConsumer() {
        const {consumerName} = this.state.createState!;
        const {backendService} = this.props;
        backendService.postConsumer(consumerName)
            .then(this.refresh)
            .catch(console.log);
        this.handleCloseCreate();
    }

    applyChangeActive(consumer: ConsumerModel) {
        const {backendService} = this.props;
        backendService.putConsumer({...consumer, active: !consumer.active})
            .then(this.refresh)
            .catch(console.log);
    }

    applyDelete(consumer: ConsumerModel) {
        const {backendService} = this.props;
        backendService.removeConsumer(consumer.consumerId)
            .then(this.refresh)
            .catch(console.log)
    }

    render() {
        const {classes} = this.props;

        const ConsumerCard = (consumer: ConsumerModel) => {
            return (
                <ListItem key={consumer.consumerId} role={undefined} button
                          onClick={() => this.handleClickOpenEdit(consumer)}>
                    <ListItemText primary={consumer.name}/>
                    <ListItemSecondaryAction>
                        <IconButton
                            edge="end"
                            arial-label="show or hide"
                            onClick={() => this.applyChangeActive(consumer)}
                            className={classes.secondaryAction}>
                            {consumer.active ? <VisibilityIcon/> : <VisibilityOffIcon/>}
                        </IconButton>
                        <IconButton
                            edge="end"
                            arial-label="delete"
                            onClick={() => this.applyDelete(consumer)}
                            className={classes.secondaryAction}>
                            <DeleteIcon/>
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            )
        };

        const {consumers, editState, createState} = this.state;
        const openEdit = editState != null && editState.open;
        const openCreate = createState != null && createState.open;

        return (
            <React.Fragment>
                <DefaultAppBar title='Consumers'/>
                <Container maxWidth="sm" disableGutters>
                    <Box my={1}>
                        <Paper variant="outlined">
                            {consumers && <List>{consumers.map(ConsumerCard)}</List>}
                        </Paper>
                    </Box>
                </Container>
                <Fab color="primary" aria-label="add" onClick={() => this.handleClickOpenCreate()}><AddIcon/></Fab>

                <Dialog open={openEdit} onClose={() => this.handleCloseEdit()} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Change consumer</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Consumer name"
                            fullWidth
                            value={editState?.consumerName}
                            onChange={(e) => this.setState(
                                {editState: {...editState!, consumerName: e.target.value}}
                            )}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.handleCloseEdit()} color="primary">Cancel</Button>
                        <Button onClick={() => this.applyEditConsumer()} color="primary">Rename</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={openCreate} onClose={() => this.handleCloseCreate()} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Add consumer</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please enter a meaningful name
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Consumer name"
                            fullWidth
                            value={createState?.consumerName}
                            onChange={(e) => this.setState(
                                {createState: {...createState!, consumerName: e.target.value}}
                            )}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.handleCloseCreate()} color="primary">Cancel</Button>
                        <Button onClick={() => this.applyCreateConsumer()} color="primary">Create</Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(Consumers);
