import {AlertColor, Snackbar} from "@mui/material";
import { Alert } from '@mui/material';
import React from "react";

export interface Props {
    open: boolean
    onClose: () => void
    message?: string,
    severity?: AlertColor
    autoHideDuration?: number
}

export function AlertSnackbar(props: Props) {
    const severity = props.severity ?? "error";
    const autoHideDuration = props.autoHideDuration ?? 3000;
    return (
        <Snackbar open={props.open} autoHideDuration={autoHideDuration} onClose={props.onClose}>
            <Alert variant="filled" onClose={props.onClose} severity={severity}>{props.message}</Alert>
        </Snackbar>
    );
}
