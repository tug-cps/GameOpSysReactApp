import {ConsumerModel} from "../service/Model";
import React, {ChangeEvent, useState} from "react";
import {iconLookup, translate} from "../common/ConsumerTools";
import {useTranslation} from "react-i18next";
import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, List, ListItem,
    ListItemAvatar, ListItemText, Paper,
    TextField
} from "@material-ui/core";

export function useEditConsumerDialog(onApplyEdit: (consumer: ConsumerModel, closeDialog: () => void) => void) {
    const [state, setState] = useState<{ consumer?: ConsumerModel, consumerName?: string, open: boolean }>({open: false});
    const onOpen = (consumer: ConsumerModel) => setState({
        consumer: consumer,
        consumerName: translate(consumer.name, consumer.customName),
        open: true
    });
    const onClose = () => setState(prevState => ({...prevState, open: false}))
    return [{
        ...state,
        onClose: onClose,
        onApply: () => onApplyEdit({...state.consumer!, customName: state.consumerName!}, onClose),
        onChange: (e: ChangeEvent<HTMLInputElement>) => setState(prevState => ({
            ...prevState,
            consumerName: e.target.value
        }))
    } as Props, onOpen] as const
}

interface Props {
    open: boolean
    consumerName: string
    consumer?: ConsumerModel
    onClose: () => void
    onApply: () => void
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export function EditConsumerDialog(props: Props) {
    const {t} = useTranslation();
    return (
        <Dialog open={props.open} onClose={props.onClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{t('title_edit_consumer')}</DialogTitle>
            <DialogContent>
                <Paper variant="outlined">
                    <List>
                        <ListItem role={undefined}>
                            <ListItemAvatar><Avatar>{iconLookup(props.consumer?.type)}</Avatar></ListItemAvatar>
                            <ListItemText primary={props.consumerName}/>
                        </ListItem>
                    </List>
                </Paper>
            </DialogContent>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label={t('consumer_name')}
                    fullWidth
                    variant="filled"
                    value={props.consumerName}
                    onChange={props.onChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose} color="primary">{t('dialog_button_cancel')}</Button>
                <Button onClick={props.onApply} color="primary">{t('dialog_button_rename')}</Button>
            </DialogActions>
        </Dialog>
    )
}
