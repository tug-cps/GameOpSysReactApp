import {ConsumerModel} from "../service/Model";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper
} from "@material-ui/core";
import {iconLookup, translate} from "../common/ConsumerTools";

export function useDeleteConsumerDialog(onApplyDelete: (consumer: ConsumerModel, onClose: () => void) => void) {
    const [state, setState] = useState<{
        consumer?: ConsumerModel
        open: boolean
    }>({open: false});
    const onOpen = (consumer: ConsumerModel) => setState({consumer: consumer, open: true})
    const onClose = () => setState(prevState => ({...prevState, open: false}))
    return [{
        ...state,
        onClose: onClose,
        onApply: () => onApplyDelete(state.consumer!, onClose),
    } as Props, onOpen] as const
}

interface Props {
    open: boolean
    onClose: () => void
    onApply: () => void
    consumer?: ConsumerModel
}

export function DeleteConsumerDialog(props: Props) {
    const {t} = useTranslation();
    const {consumer} = props;
    return (<Dialog open={props.open} onClose={props.onClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{t('confirm_dialog_title')}</DialogTitle>
        {consumer && <React.Fragment>
            <DialogContent>
                <Paper variant="outlined">
                    <List>
                        <ListItem role={undefined}>
                            <ListItemAvatar><Avatar>{iconLookup(consumer.type)}</Avatar></ListItemAvatar>
                            <ListItemText primary={translate(consumer.name, consumer.customName)}/>
                        </ListItem>
                    </List>
                </Paper>
            </DialogContent>

            <DialogContent>
                <DialogContentText>{t('confirm_dialog_content', {text: translate(consumer.name, consumer.customName)})}</DialogContentText>
            </DialogContent>
        </React.Fragment>}
        <DialogActions>
            <Button onClick={props.onClose} color="primary">{t('dialog_button_cancel')}</Button>
            <Button onClick={props.onApply} color="primary">{t('dialog_button_delete')}</Button>
        </DialogActions>
    </Dialog>)
}
