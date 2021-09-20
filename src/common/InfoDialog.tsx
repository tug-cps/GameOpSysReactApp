import React, {useCallback, useState} from "react";
import {
    AppBar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme
} from "@material-ui/core";
import {ArrowBack} from "@material-ui/icons";

export function useInfoDialog(): readonly [{ open: boolean, onClose: () => void }, () => void] {
    const [state, setState] = useState(false);
    return [{open: state, onClose: () => setState(false)}, useCallback(() => setState(true), [])]
}

export function Lorem() {
    return <>
        <DialogContentText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec interdum orci nibh, ac porttitor
            metus lacinia sit amet. Vivamus mollis porttitor mauris sed placerat. Duis porttitor gravida
            justo, ut facilisis sapien. Nunc ultricies porta lectus, sit amet sollicitudin elit pulvinar ut.
            Donec quis porta ex. Aenean vehicula tortor eu enim semper rhoncus. Sed scelerisque tempor
            placerat. Suspendisse euismod turpis ante, a facilisis tellus scelerisque quis. Morbi vel leo
            nec enim iaculis faucibus eu eu enim. Donec semper purus urna, vel iaculis eros placerat in.
        </DialogContentText>
        <DialogContentText>
            Sed eu erat finibus, ultrices magna vitae, scelerisque libero. Aliquam vel massa pretium,
            feugiat justo nec, accumsan ligula. Ut eget lacinia libero, vel placerat ipsum. Phasellus
            fringilla consequat metus, at ultricies lectus posuere in. Integer ut arcu id mauris maximus
            iaculis. Nullam lacinia, justo sed porta dapibus, purus dolor faucibus dolor, eget viverra nunc
            turpis at lectus. Aenean et lobortis mauris, a porttitor mi. Quisque sit amet dictum risus.
            Aenean vel tortor vel justo vestibulum consequat et dictum nunc. Pellentesque mattis urna
            consectetur mauris dapibus, quis maximus lorem porta. Cras sagittis lacus ut suscipit
            ullamcorper. Sed ultrices velit a venenatis elementum. Curabitur tincidunt lorem non dignissim
            bibendum.
        </DialogContentText>
    </>
}

interface Props {
    title: string
    content: JSX.Element
    open: boolean
    onClose: () => void
}

export function InfoDialog(props: Props) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Dialog fullScreen={fullScreen} open={props.open} onClose={props.onClose}>
            {fullScreen &&
            <AppBar>
                <Toolbar>
                    <IconButton color="inherit" edge="start" onClick={props.onClose}
                                style={{marginRight: theme.spacing(2)}}><ArrowBack/></IconButton>
                    <Typography variant="h6">{props.title}</Typography>
                </Toolbar>
            </AppBar>
            }
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>{props.content}</DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>OK</Button>
            </DialogActions>
        </Dialog>
    )
}
