import React from 'react';
import {
    Box,
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
import {WithTranslation, withTranslation} from "react-i18next";

const styles = () => createStyles({
    input: {
        display: 'none',
    },
});

interface Operator {
    name: string;
    link: string;
}

interface Props extends WithStyles<typeof styles>, WithTranslation {
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

        const {classes, t} = this.props;
        return (
            <div>
                <DefaultAppBar hideBackButton title={t('card_upload_title')}/>
                <Container maxWidth="md">
                    <Box my={1}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h5" gutterBottom>{t('upload_title_download')}</Typography>
                                <Typography color="textSecondary" paragraph>
                                    {t('upload_instruction_download')}
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
                                <Typography variant="h5" gutterBottom>{t('upload_title_upload')}</Typography>
                                <Typography color="textSecondary" paragraph>
                                    {t('upload_instruction_upload')}
                                </Typography>
                                <input accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                       className={classes.input}
                                       id="input-file"
                                       type="file"
                                       onChange={this.onFormUpload}/>
                                <label htmlFor="input-file">
                                    <Button variant="contained" color="primary" fullWidth component="span">{t('action_upload')}</Button>
                                </label>
                            </Grid>
                        </Grid>
                    </Box>
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

export default withStyles(styles)(withTranslation()(Upload));
