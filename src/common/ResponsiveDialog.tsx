import ArrowBack from "@mui/icons-material/ArrowBack";
import {AppBar, Dialog, DialogTitle, IconButton, Toolbar, Typography, useMediaQuery, useTheme} from "@mui/material";
import React from "react";

interface Props {
    title: string
    open: boolean
    onClose: () => void
}

export function ResponsiveDialog(props: React.PropsWithChildren<Props>) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Dialog
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
                        size="large"><ArrowBack/></IconButton>
                    <Typography variant="h6">{props.title}</Typography>
                </Toolbar>
            </AppBar>
            }
            <DialogTitle>{props.title}</DialogTitle>
            {props.children}
        </Dialog>
    );
}
