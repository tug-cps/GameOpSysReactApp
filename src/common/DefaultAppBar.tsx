import {
    AppBar,
    Box,
    createStyles,
    IconButton,
    Theme,
    Toolbar,
    Typography,
    WithStyles
} from "@material-ui/core";
import {RouteComponentProps} from "react-router-dom";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import React from "react";
import {withStyles} from "@material-ui/core/styles";
import {withRouter} from "react-router";

const styles = ({spacing}: Theme) => createStyles({
    menuButton: {
        marginRight: spacing(2),
    }
});

export interface Props extends WithStyles<typeof styles>, RouteComponentProps {
    hideBackButton?: boolean;
    title: string;
    multiLine?: React.ReactNode;
}

function DefaultAppBar(props: React.PropsWithChildren<Props>) {
    const {title, classes, history} = props;
    return (
        <React.Fragment>
            <AppBar position="fixed">
                <Toolbar>
                    {props.hideBackButton !== true && (
                        <IconButton
                            edge="start"
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="back"
                            onClick={() => history.go(-1)}
                        >
                            <ArrowBackIcon/>
                        </IconButton>
                    )}
                    <Typography color="inherit" variant="h6">{title}</Typography>
                    <Box mx="auto"/>
                    {props.children}
                </Toolbar>
                {props.multiLine}
            </AppBar>
            <Toolbar style={{visibility: "hidden"}}/>
        </React.Fragment>
    )
}

export default withStyles(styles)(withRouter(DefaultAppBar));