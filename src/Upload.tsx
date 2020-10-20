import React from 'react';
import {
    AppBar,
    Button,
    Container, createStyles,
    Grid,
    IconButton, List, ListItem, Snackbar,
    Theme,
    Toolbar,
    Typography, WithStyles
} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CloseIcon from '@material-ui/icons/Close';
import {Link, RouteComponentProps} from "react-router-dom";
import {apiClient} from "./ApiClient";

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

interface Operator {
    name: string;
    link: string;
}

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
}

interface State {
    open: boolean
}

class Upload extends React.Component<Props, State> {

    constructor(props: Readonly<Props>) {
        super(props);
        this.state = {
            open: false
        }
        this.onFormUpload = this.onFormUpload.bind(this)
        this.handleClose = this.handleClose.bind(this)
    }

    onFormUpload(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target != null && event.target.files != null) {
            apiClient.postConsumption(event.target.files[0]).then(() => {
                console.log("File uploaded.")
                this.setState({open: true})
            });
        }
    }

    handleClose (event: React.SyntheticEvent | React.MouseEvent, reason?: string) {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({open: false});
    }

    render() {
        const operators: Operator[] = [
            {name: 'Netz Oberösterreich', link: 'https://netz-online.netzgmbh.at/eServiceWeb/main.html'},
            {name: 'Netz Burgenland', link: 'https://smartmeter.netzburgenland.at'},
            {name: 'Kärnten Netz', link: 'https://meinportal.kaerntennetz.at/meinPortal/Login.aspx?service=verbrauch'},
        ]

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
                        <Typography variant="h6" className={classes.title}>Upload</Typography>
                    </Toolbar>
                </AppBar>
                <Container maxWidth="md">
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h5" gutterBottom>1. Download most recent data</Typography>
                            <Typography color="textSecondary" paragraph>
                                Please select your network operator to download the most recent consumption data
                            </Typography>
                            <List>
                                {operators.map((op) => {
                                    return (
                                        <ListItem key={op.name}>
                                            <Link to={op.link}>{op.name}</Link>
                                        </ListItem>)
                                })}
                            </List>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h5" gutterBottom>2. Upload your consumption</Typography>
                            <Typography color="textSecondary" paragraph>
                                Please upload the file with the most recent consumptions here
                            </Typography>
                            <input accept="*/*" className={classes.input} id="input-file" type="file" onChange={this.onFormUpload}/>
                            <label htmlFor="input-file">
                                <Button variant="contained" color="primary" fullWidth component="span">Upload</Button>
                            </label>
                        </Grid>
                    </Grid>
                </Container>
                <Snackbar
                    anchorOrigin={{vertical: 'bottom', horizontal: 'left',}}
                    open={this.state.open}
                    autoHideDuration={6000}
                    onClose={this.handleClose}
                    message="File uploaded"
                    action={
                        <React.Fragment>
                            <IconButton size="small" aria-label="close" color="inherit" onClick={this.handleClose}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </React.Fragment>
                    }
                />
            </div>
        )
    }
}

export default withStyles(styles)(Upload);
