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

interface DeleteState {
    consumer: ConsumerModel
    open: boolean
}

interface State {
    consumers?: ConsumerModel[]
    editState?: EditState,
    createState?: CreateState,
    deleteState?: DeleteState
}

class Consumers extends React.Component<Props, State> {

    constructor(props: Readonly<Props>) {
        super(props);
        this.state = {}
        this.refresh = this.refresh.bind(this);
    }

    componentDidMount() {
        this.refresh()
    }

    refresh() {
        const {backendService} = this.props;
        backendService.getConsumers()
            .then((consumers) => this.setState({consumers: consumers}))
            .catch((reason) => {
                console.log(reason)
            })
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

    handleClickCloseEdit() {
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

    handleClickCloseCreate() {
        this.setState({createState: {...this.state.createState!, open: false}});
    }

    handleClickOpenDelete(consumer: ConsumerModel) {
        this.setState({
            deleteState: {
                consumer: consumer,
                open: true
            }
        });
    }

    handleClickCloseDelete() {
        this.setState({deleteState: {...this.state.deleteState!, open: false}});
    }

    applyEditConsumer() {
        const {consumer, consumerName} = this.state.editState!;
        const {backendService} = this.props;
        backendService.putConsumer({...consumer, name: consumerName})
            .then(this.refresh)
            .catch(console.log);
        this.handleClickCloseEdit();
    }

    applyCreateConsumer() {
        const {consumerName} = this.state.createState!;
        const {backendService} = this.props;
        backendService.postConsumer(consumerName)
            .then(this.refresh)
            .catch(console.log);
        this.handleClickCloseCreate();
    }

    applyChangeActive(consumer: ConsumerModel) {
        const {backendService} = this.props;
        backendService.putConsumer({...consumer, active: !consumer.active})
            .then(this.refresh)
            .catch(console.log);
    }

    applyDelete() {
        const {backendService} = this.props;
        const {deleteState} = this.state;
        backendService.removeConsumer(deleteState!.consumer.consumerId)
            .then(() => this.handleClickCloseDelete())
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
                            onClick={() => this.handleClickOpenDelete(consumer)}
                            className={classes.secondaryAction}>
                            <DeleteIcon/>
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            )
        };

        const {consumers, editState, createState, deleteState} = this.state;
        const openEdit = editState != null && editState.open;
        const openCreate = createState != null && createState.open;
        const openDelete = deleteState != null && deleteState.open;

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

                <Dialog open={openEdit} onClose={() => this.handleClickCloseEdit()} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Change consumer</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Consumer name"
                            fullWidth
                            variant="filled"
                            value={editState?.consumerName}
                            onChange={(e) => this.setState(
                                {editState: {...editState!, consumerName: e.target.value}}
                            )}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.handleClickCloseEdit()} color="primary">Cancel</Button>
                        <Button onClick={() => this.applyEditConsumer()} color="primary">Rename</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={openCreate} onClose={() => this.handleClickCloseCreate()} aria-labelledby="form-dialog-title">
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
                            variant="filled"
                            value={createState?.consumerName}
                            onChange={(e) => this.setState(
                                {createState: {...createState!, consumerName: e.target.value}}
                            )}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.handleClickCloseCreate()} color="primary">Cancel</Button>
                        <Button onClick={() => this.applyCreateConsumer()} color="primary">Create</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={openDelete} onClose={() => this.handleClickCloseDelete()} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Confirm delete</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete "{deleteState?.consumer.name}"?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.handleClickCloseDelete()} color="primary">Cancel</Button>
                        <Button onClick={() => this.applyDelete()} color="primary">Delete</Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(Consumers);
