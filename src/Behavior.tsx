import React from 'react';
import {AppBar, Container, createStyles, IconButton, Theme, Toolbar, Typography, WithStyles} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {RouteComponentProps} from "react-router-dom";

const styles = (theme: Theme) => createStyles({
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    input: {
        display: 'none',
    },
});


interface Props extends WithStyles<typeof styles>, RouteComponentProps {
}

interface State {
}

class Behavior extends React.Component<Props, State> {
    render() {
        const {classes} = this.props;
        return (
            <div>
                <AppBar position="sticky">
                    <Toolbar>
                        <IconButton
                            edge="start"
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="back"
                            onClick={() => this.props.history.go(-1)}>
                            <ArrowBackIcon/>
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>Behavior</Typography>
                    </Toolbar>
                </AppBar>
                <Container maxWidth="md">
                    <Typography variant="h4">Not implemented</Typography>
                </Container>
            </div>
        )
    }
}

export default withStyles(styles)(Behavior);
