import {useTranslation} from "react-i18next";
import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, List, ListItem, ListItemAvatar, ListItemText, Paper,
    TextField
} from "@mui/material";
import React, {ChangeEvent, useState} from "react";
import {iconLookup} from "../common/ConsumerTools";

interface Props {
    open: boolean
    consumerName?: string
    onClose: () => void
    onApply: () => void
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export function useCreateConsumerDialog(onApply: (consumerName: string, onClose: () => void) => void) {
    const [state, setState] = useState<{ open: boolean, consumerName?: string }>({open: false});
    const onOpen = () => setState({consumerName: "", open: true});
    const onClose = () => setState(prevState => ({...prevState, open: false}));
    return [{
        ...state,
        onClose: onClose,
        onApply: () => onApply(state.consumerName!, onClose),
        onChange: (e: ChangeEvent<HTMLInputElement>) => setState(prevState => ({
            ...prevState,
            consumerName: e.target.value
        }))
    } as Props, onOpen] as const;
}

export function CreateConsumerDialog(props: Props) {
    const {t} = useTranslation();
    return (<Dialog open={props.open} onClose={props.onClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{t('title_create_consumer')}</DialogTitle>
        <DialogContent>
            <Paper variant="outlined">
                <List>
                    <ListItem role={undefined}>
                        <ListItemAvatar><Avatar>{iconLookup("misc")}</Avatar></ListItemAvatar>
                        <ListItemText primary={props.consumerName}/>
                    </ListItem>
                </List>
            </Paper>
        </DialogContent>
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
                value={props.consumerName}
                onChange={props.onChange}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose} color="primary">{t('dialog_button_cancel')}</Button>
            <Button onClick={props.onApply} color="primary">{t('dialog_button_create')}</Button>
        </DialogActions>
    </Dialog>);
}
