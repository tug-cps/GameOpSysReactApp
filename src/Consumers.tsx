import React from 'react';
import {
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Fab,
    List,
    Paper,
    TextField
} from "@material-ui/core";
import BackendService from "./service/BackendService";
import DefaultAppBar from "./common/DefaultAppBar";
import {ConsumerModel} from "./service/Model";
import AddIcon from '@material-ui/icons/Add';
import ConsumerCard from "./ConsumerCard";
import {WithTranslation, withTranslation} from "react-i18next";
import {translate} from "./common/ConsumerTools";

interface Props extends WithTranslation {
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
    editState?: EditState
    createState?: CreateState
    deleteState?: DeleteState
}

class Consumers extends React.Component<Props, State> {
    constructor(props: Readonly<Props>) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        this.refresh()
    }

    refresh() {
        const {backendService} = this.props;
        backendService.getConsumers()
            .then((consumers) => this.setState({consumers: consumers}))
            .catch(console.log)
    }

    handleClickOpenEdit(consumer: ConsumerModel) {
        this.setState({
            editState: {
                consumer: consumer,
                consumerName: translate(consumer.name, consumer.customName),
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
        backendService.putConsumer({...consumer, customName: consumerName})
            .then(() => this.refresh())
            .catch(console.log);
        this.handleClickCloseEdit();
    }

    applyCreateConsumer() {
        const {consumerName} = this.state.createState!;
        const {backendService} = this.props;
        backendService.postConsumer(consumerName)
            .then(() => this.refresh())
            .catch(console.log);
        this.handleClickCloseCreate();
    }

    applyChangeActive(consumer: ConsumerModel) {
        const {backendService} = this.props;
        backendService.putConsumer({...consumer, active: !consumer.active})
            .then(() => this.refresh())
            .catch(console.log);
    }

    applyDelete() {
        const {backendService} = this.props;
        const {deleteState} = this.state;
        backendService.removeConsumer(deleteState!.consumer.consumerId)
            .then(() => this.handleClickCloseDelete())
            .then(() => this.refresh())
            .catch(console.log)
    }

    render() {
        const {consumers, editState, createState, deleteState} = this.state;
        const {t} = this.props;
        const openEdit = editState != null && editState.open;
        const openCreate = createState != null && createState.open;
        const openDelete = deleteState != null && deleteState.open;

        return (
            <React.Fragment>
                <DefaultAppBar title={t('edit_consumers')}/>
                <Container maxWidth="sm" disableGutters>
                    <Box my={1}>
                        <Paper variant="outlined">
                            <List>
                                {consumers && consumers.map((it) =>
                                    <ConsumerCard
                                        consumer={it}
                                        clickEdit={(c) => this.handleClickOpenEdit(c)}
                                        clickActive={(c) => this.applyChangeActive(c)}
                                        clickDelete={(c) => this.handleClickOpenDelete(c)}
                                    />
                                )}
                            </List>
                        </Paper>
                    </Box>
                </Container>
                <Fab color="primary" aria-label="add" onClick={() => this.handleClickOpenCreate()}><AddIcon/></Fab>

                <Dialog open={openEdit} onClose={() => this.handleClickCloseEdit()} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">{t('title_edit_consumer')}</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label={t('consumer_name')}
                            fullWidth
                            variant="filled"
                            value={editState?.consumerName}
                            onChange={(e) => this.setState(
                                {editState: {...editState!, consumerName: e.target.value}}
                            )}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.handleClickCloseEdit()}
                                color="primary">{t('dialog_button_cancel')}</Button>
                        <Button onClick={() => this.applyEditConsumer()}
                                color="primary">{t('dialog_button_rename')}</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={openCreate} onClose={() => this.handleClickCloseCreate()}
                        aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">{t('title_create_consumer')}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>{t('description_consumer_name')}
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label={t('consumer_name')}
                            fullWidth
                            variant="filled"
                            value={createState?.consumerName}
                            onChange={(e) => this.setState(
                                {createState: {...createState!, consumerName: e.target.value}}
                            )}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.handleClickCloseCreate()}
                                color="primary">{t('dialog_button_cancel')}</Button>
                        <Button onClick={() => this.applyCreateConsumer()}
                                color="primary">{t('dialog_button_create')}</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={openDelete} onClose={() => this.handleClickCloseDelete()}
                        aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">{t('confirm_dialog_title')}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>{t('confirm_dialog_content', {text: translate(deleteState?.consumer.name, deleteState?.consumer.customName)})}</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.handleClickCloseDelete()}
                                color="primary">{t('dialog_button_cancel')}</Button>
                        <Button onClick={() => this.applyDelete()} color="primary">{t('dialog_button_delete')}</Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        );
    }
}

export default withTranslation()(Consumers);
