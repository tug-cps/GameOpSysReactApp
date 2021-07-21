import React from 'react';
import {
    Button,
    Container,
    createStyles,
    Grid,
    IconButton,
    Link,
    List,
    ListItem,
    Snackbar,
    Typography,
    WithStyles
} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import CloseIcon from '@material-ui/icons/Close';
import DefaultAppBar from "./common/DefaultAppBar";
import BackendService from "./service/BackendService";

const styles = () => createStyles({
    input: {
        display: 'none',
    },
});

interface Operator {
    name: string;
    link: string;
}

interface Props extends WithStyles<typeof styles> {
    backendService: BackendService
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
            this.props.backendService.postConsumption(event.target.files[0]).then(() => {
                console.log("File uploaded.")
                this.setState({open: true})
            });
        }
    }

    handleClose(event: React.SyntheticEvent | React.MouseEvent, reason?: string) {
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
                <DefaultAppBar title='Upload'/>
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
                                            <Typography><Link href={op.link}>{op.name}</Link></Typography>
                                        </ListItem>
                                    )
                                })}
                            </List>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h5" gutterBottom>2. Upload your consumption</Typography>
                            <Typography color="textSecondary" paragraph>
                                Please upload the file with the most recent consumptions here
                            </Typography>
                            <input accept="*/*" className={classes.input} id="input-file" type="file"
                                   onChange={this.onFormUpload}/>
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
                                <CloseIcon fontSize="small"/>
                            </IconButton>
                        </React.Fragment>
                    }
                />
            </div>
        )
    }
}

export default withStyles(styles)(Upload);
