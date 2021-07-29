import React from 'react';
import {
    Button,
    Container,
    createStyles,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    Input,
    InputLabel,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
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
import { Delete } from '@material-ui/icons';

const styles = ({palette}: Theme) => createStyles({
    list: {
        backgroundColor: palette.background.paper,
    },
});


interface Props extends WithStyles<typeof styles> {
    backendService: BackendService
}

interface State {
    consumers: ConsumerModel[]
    open: boolean
    consumerName: string
    consumerInput: string
    selectedConsumer?: ConsumerModel
}

class Consumers extends React.Component<Props, State> {

    constructor(props: Readonly<Props>) {
        super(props);
        this.state = {
            consumers: [],
            open: false,
            consumerName: "",
            consumerInput: ""
        }

        this.refresh = this.refresh.bind(this);
    }

    refresh() {
        const {backendService} = this.props;
        backendService.getConsumers()
            .then((consumers) => this.setState({consumers: consumers}))
            .catch((reason) => {console.log(reason)})
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
            const {selectedConsumer} = this.state;
            if (selectedConsumer != null) {
                this.props.backendService.putConsumer({...selectedConsumer, name: this.state.consumerName}).then(this.refresh);
                handleClose();
            }
        }

        const handleChangeActive = (consumer: ConsumerModel) => {
            this.props.backendService.putConsumer({...consumer, active: !consumer.active}).then(this.refresh);
        }

        const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
            this.setState({consumerInput: e.currentTarget.value})
        }

        const handleAddConsumer = (e : React.SyntheticEvent) => {
            e.preventDefault();
            let newConsumer : ConsumerModel = { consumerId:"",owner:"", 
                                                name:this.state.consumerInput,
                                                variableName:"", 
                                                active:true };
            newConsumer.consumerId = Math.floor(Math.random() * 100).toString();
            this.setState(prevState => ({
                consumers: [...prevState.consumers, newConsumer],
                consumerInput:""
            }))
            this.props.backendService.postConsumer(newConsumer).then(this.refresh);
        }

        const handleRemoveConsumer = (id : string) => {
            this.setState(prevState => ({
                consumers: [...prevState.consumers.filter((consumer:ConsumerModel) => consumer.consumerId !== id)]
            }))

        }

        const ConsumerCard = (consumer: ConsumerModel) => {
            return (
                <ListItem key={consumer.consumerId} role={undefined} button onClick={() => handleClickOpen(consumer)}>
                    <ListItemText primary={consumer.name}/>
                    <ListItemSecondaryAction onClick={() => handleChangeActive(consumer)}>
                        <IconButton onClick={() => handleRemoveConsumer(consumer.consumerId)}>
                            <Delete/>
                        </IconButton>
                        <IconButton edge="end" arial-label="show or hide">
                            {consumer.active ? <VisibilityIcon/> : <VisibilityOffIcon/>}
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            )
        };

        const {consumers, open, consumerName} = this.state;
        return (
            <React.Fragment>
                <form onSubmit={handleAddConsumer}>
                <DefaultAppBar title='Consumers'/>
                <FormControl>
                    <InputLabel htmlFor="new-consumer">Add new consumer</InputLabel>
                    <Input id="new-consumer" onChange={onChange}/>
                    <Button type="submit">Submit</Button>
                </FormControl>
                </form>
                <Container maxWidth="sm" disableGutters>
                    <List className={classes.list}>
                        {consumers.map(ConsumerCard)}
                    </List>
                </Container>
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
