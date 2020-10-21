import {AppBar, createStyles, IconButton, Theme, Toolbar, Typography, WithStyles} from "@material-ui/core";
import {RouteComponentProps} from "react-router-dom";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import React from "react";
import {withStyles} from "@material-ui/core/styles";
import { withRouter } from "react-router";

const styles = ({spacing}: Theme) => createStyles({
    menuButton: {
        marginRight: spacing(2),
    },
    title: {
        flexGrow: 1,
    },
});

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
    title: string;
}

class DefaultAppBar extends React.Component<Props> {
    render() {
        const {title, classes, history} = this.props;
        return (
            <AppBar position="sticky">
                <Toolbar>
                    <IconButton
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="back"
                        onClick={() => history.go(-1)}
                    >
                        <ArrowBackIcon/>
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>{title}</Typography>
                </Toolbar>
            </AppBar>
        )
    }
}

export default withStyles(styles)(withRouter(DefaultAppBar));