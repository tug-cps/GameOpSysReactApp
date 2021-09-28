import {StaticTimePicker} from "@mui/lab";
import {Button, DialogActions, DialogContent, InputAdornment, TextField} from "@mui/material";
import React from "react";
import {useTranslation} from "react-i18next";
import {ResponsiveDialog} from "../common/ResponsiveDialog";

interface Props {
    title: string
    open: boolean
    showTimePicker: boolean
    onClose: () => void
    onOK: () => void
    time: Date | null
    setTime: (time: Date | null) => void
    temperature: string | null
    setTemperature: (temperature: string | null) => void
}

export function ModifyTimeItemDialog(props: Props) {
    const {t} = useTranslation();
    return <ResponsiveDialog title={props.title} open={props.open} onClose={props.onClose}>
        <DialogContent>
            {props.showTimePicker &&
            <StaticTimePicker
                label={t('thermostat_select_time')}
                ampm={false}
                value={props.time}
                onChange={(date) => props.setTime(date)}
                renderInput={() => <></>}
            />
            }
            <TextField
                variant="filled"
                sx={{my: 2}}
                fullWidth
                label={t('thermostat_temperature')}
                type="number"
                value={props.temperature}
                onChange={(e) => props.setTemperature(e.target.value)}
                InputProps={{endAdornment: <InputAdornment position="start">°C</InputAdornment>}}/>
        </DialogContent>
        <DialogActions>
            <Button color="primary" onClick={props.onClose}>{t('dialog_button_cancel')}</Button>
            <Button color="primary" onClick={props.onOK}>{t('dialog_button_ok')}</Button>
        </DialogActions>
    </ResponsiveDialog>
}
