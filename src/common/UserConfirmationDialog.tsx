import {useTranslation} from "react-i18next";
import {ResponsiveDialog} from "./ResponsiveDialog";
import {Button, DialogActions, DialogContent, DialogContentText} from "@mui/material";
import React, {useCallback, useState} from "react";

export const UserConfirmationDialog = (props: { open: boolean, onAccept: () => void, onClose: () => void, message: string }) => {
    const {t} = useTranslation();

    return (
        <ResponsiveDialog title={t('confirm_title') as string}
                          open={props.open}
                          onClose={props.onClose}>
            <DialogContent>
                <DialogContentText>{props.message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>{t('dialog_button_cancel')}</Button>
                <Button onClick={props.onAccept}>{t('dialog_button_ok')}</Button>
            </DialogActions>
        </ResponsiveDialog>
    )
}

export const useUserConfirmationDialog = () => {
    const [state, setState] = useState<{ open: boolean, message: string, callback: (ok: boolean) => void }>({
        open: false,
        message: "",
        callback: () => {
        }
    });
    const userConfirm = useCallback((message: string, callback: (ok: boolean) => void) =>
        setState({open: true, message: message, callback: callback}), [])
    const confirm = useCallback((ok: boolean) => {
        setState(prevState => {
            prevState.callback(ok);
            return {...prevState, open: false}
        });
    }, []);
    return [{
        open: state.open,
        onAccept: () => confirm(true),
        onClose: () => confirm(false),
        message: state.message
    }, userConfirm] as const
}
