import React from "react";
import {AppBar, Dialog, DialogTitle, IconButton, Toolbar, Typography, useMediaQuery, useTheme} from "@material-ui/core";
import {ArrowBack} from "@material-ui/icons";

interface Props {
    title: string
    open: boolean
    onClose: () => void
}

export function ResponsiveDialog(props: React.PropsWithChildren<Props>) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

    return <Dialog
        open={props.open}
        onClose={props.onClose}
        fullScreen={fullScreen}
    >
        {fullScreen &&
        <AppBar>
            <Toolbar>
                <IconButton
                    color="inherit"
                    edge="start"
                    onClick={props.onClose}
                    style={{marginRight: theme.spacing(2)}}
                ><ArrowBack/></IconButton>
                <Typography variant="h6">{props.title}</Typography>
            </Toolbar>
        </AppBar>
        }
        <DialogTitle>{props.title}</DialogTitle>
        {props.children}
    </Dialog>
}
