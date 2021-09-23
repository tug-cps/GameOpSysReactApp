import React from "react";
import {Button, DialogActions, DialogContent, InputAdornment, TextField, Typography} from "@material-ui/core";
import {ResponsiveDialog} from "../common/ResponsiveDialog";
import {StaticTimePicker} from "@mui/lab";

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
    return <ResponsiveDialog title={props.title} open={props.open} onClose={props.onClose}>
        <DialogContent>
            {props.showTimePicker &&
            <>
                <Typography variant="subtitle2">Time</Typography>
                <StaticTimePicker
                    label="Select Time"
                    ampm={false}
                    value={props.time}
                    onChange={(date) => props.setTime(date)}
                    renderInput={() => <></>}
                />
            </>
            }
            <Typography variant="subtitle2">Temperature</Typography>
            <TextField
                variant="filled"
                fullWidth
                label="Temperature"
                type="number"
                value={props.temperature}
                onChange={(e) => props.setTemperature(e.target.value)}
                InputProps={{endAdornment: <InputAdornment position="start">°C</InputAdornment>}}/>
        </DialogContent>
        <DialogActions>
            <Button color="primary" onClick={props.onClose}>Cancel</Button>
            <Button color="primary" onClick={props.onOK}>OK</Button>
        </DialogActions>
    </ResponsiveDialog>
}
