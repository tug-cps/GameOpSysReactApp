import React from 'react';
import {
    Button,
    Container,
    createStyles,
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
    WithStyles
} from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import {withStyles} from "@material-ui/core/styles";
import {apiClient, ConsumerModel} from "./common/ApiClient";
import DefaultAppBar from "./common/DefaultAppBar";

const styles = ({palette}: Theme) => createStyles({
    list: {
        backgroundColor: palette.background.paper,
    },
});


interface Props extends WithStyles<typeof styles> {
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
            const {selectedConsumer} = this.state;
            if (selectedConsumer != null) {
                apiClient.putConsumer({...selectedConsumer, name: this.state.consumerName}).then(this.refresh);
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

        const {consumers, open, consumerName} = this.state;
        return (
            <React.Fragment>
                <DefaultAppBar title='Consumers'/>
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
