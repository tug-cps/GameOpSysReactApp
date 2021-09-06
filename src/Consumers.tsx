import React, {useEffect, useState} from 'react';
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

function Consumers(props: Props) {
    const [state, setState] = useState<State>({});
    const {backendService} = props;

    const refresh = () => {
        backendService.getConsumers()
            .then((consumers) => setState({consumers: consumers}))
            .catch(console.log)
    }

    const handleClickOpenEdit = (consumer: ConsumerModel) => {
        setState({
            ...state,
            editState: {
                consumer: consumer,
                consumerName: translate(consumer.name, consumer.customName),
                open: true
            }
        });
    }
    const handleClickCloseEdit = () => setState({...state, editState: {...state.editState!, open: false}})

    const handleClickOpenCreate = () => {
        setState({
            ...state,
            createState: {
                consumerName: "",
                open: true
            }
        });
    }
    const handleClickCloseCreate = () => setState({...state, createState: {...state.createState!, open: false}})

    const handleClickOpenDelete = (consumer: ConsumerModel) => {
        setState({
            ...state,
            deleteState: {
                consumer: consumer,
                open: true
            }
        });
    }

    const handleClickCloseDelete = () => setState({...state, deleteState: {...state.deleteState!, open: false}})

    const applyEditConsumer = () => {
        const {consumer, consumerName} = state.editState!;
        backendService.putConsumer({...consumer, customName: consumerName})
            .then(refresh)
            .catch(console.log);
        handleClickCloseEdit();
    }

    const applyCreateConsumer = () => {
        const {consumerName} = state.createState!;
        backendService.postConsumer(consumerName)
            .then(refresh)
            .catch(console.log);
        handleClickCloseCreate();
    }

    const applyChangeActive = (consumer: ConsumerModel) => {
        backendService.putConsumer({...consumer, active: !consumer.active})
            .then(refresh)
            .catch(console.log);
    }

    const applyDelete = () => {
        const {deleteState} = state;
        backendService.removeConsumer(deleteState!.consumer.consumerId)
            .then(handleClickCloseDelete)
            .then(refresh)
            .catch(console.log)
    }

    useEffect(() => {
        backendService.getConsumers()
            .then((consumers) => setState({consumers: consumers}))
            .catch(console.log)
    }, [backendService])

    const {consumers, editState, createState, deleteState} = state;
    const {t} = props;
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
                                    clickEdit={(c) => handleClickOpenEdit(c)}
                                    clickActive={(c) => applyChangeActive(c)}
                                    clickDelete={(c) => handleClickOpenDelete(c)}
                                />
                            )}
                        </List>
                    </Paper>
                </Box>
            </Container>
            <Fab color="primary" aria-label="add" onClick={() => handleClickOpenCreate()}><AddIcon/></Fab>

            <Dialog open={openEdit} onClose={() => handleClickCloseEdit()} aria-labelledby="form-dialog-title">
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
                        onChange={(e) => setState(
                            {...state, editState: {...editState!, consumerName: e.target.value}}
                        )}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClickCloseEdit()}
                            color="primary">{t('dialog_button_cancel')}</Button>
                    <Button onClick={() => applyEditConsumer()}
                            color="primary">{t('dialog_button_rename')}</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openCreate} onClose={() => handleClickCloseCreate()}
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
                        onChange={(e) => setState(
                            {...state, createState: {...createState!, consumerName: e.target.value}}
                        )}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClickCloseCreate()}
                            color="primary">{t('dialog_button_cancel')}</Button>
                    <Button onClick={() => applyCreateConsumer()}
                            color="primary">{t('dialog_button_create')}</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openDelete} onClose={handleClickCloseDelete}
                    aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{t('confirm_dialog_title')}</DialogTitle>
                <DialogContent>
                    <Paper variant="outlined">
                        <List>
                            {deleteState?.consumer && <ConsumerCard consumer={deleteState?.consumer}/>}
                        </List>
                    </Paper>
                </DialogContent>
                <DialogContent>
                    <DialogContentText>{t('confirm_dialog_content', {text: translate(deleteState?.consumer.name, deleteState?.consumer.customName)})}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClickCloseDelete}
                            color="primary">{t('dialog_button_cancel')}</Button>
                    <Button onClick={applyDelete} color="primary">{t('dialog_button_delete')}</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default withTranslation()(Consumers);
