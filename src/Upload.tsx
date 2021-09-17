import React, {useEffect} from 'react';
import {
    Box,
    Button,
    Container,
    createStyles,
    Grid,
    Link,
    List,
    ListItem,
    Typography,
    WithStyles
} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import {useTranslation, WithTranslation, withTranslation} from "react-i18next";
import {useSnackBar} from "./common/UseSnackBar";
import {AlertSnackbar} from "./common/AlertSnackbar";
import {CloudUploadOutlined} from "@material-ui/icons";
import useDefaultTracking from "./common/Tracking";
import {PrivateRouteProps} from "./App";

const styles = () => createStyles({
    input: {
        display: 'none',
    },
});

interface Operator {
    name: string;
    link: string;
}

interface Props extends PrivateRouteProps, WithStyles<typeof styles>, WithTranslation {
}

function Upload(props: Props) {
    const {Track} = useDefaultTracking({page: 'Upload'});
    const [success, setSuccess] = useSnackBar();
    const [error, setError] = useSnackBar();
    const {t} = useTranslation();
    const {backendService, classes, setAppBar} = props;

    const onUpload = (file: File) => {
        backendService.postConsumption(file)
            .then(() => {
                console.log("File uploaded.")
                setSuccess("File uploaded");
            }, setError)
            .catch(console.log);
    }

    const operators: Operator[] = [
        {name: 'Netz Oberösterreich', link: 'https://netz-online.netzgmbh.at/eServiceWeb/main.html'},
        {name: 'Netz Burgenland', link: 'https://smartmeter.netzburgenland.at'},
        {name: 'Kärnten Netz', link: 'https://meinportal.kaerntennetz.at/meinPortal/Login.aspx?service=verbrauch'},
    ]

    useEffect(() => setAppBar({
        title: t('card_upload_title'),
        showBackButton: false,
        children: () => <></>
    }), [t, setAppBar])

    return (
        <Track>
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
                            <Typography
                                variant="h5"
                                gutterBottom
                            >{t('upload_title_upload')}</Typography>
                            <Typography
                                color="textSecondary"
                                paragraph
                            >{t('upload_instruction_upload')}</Typography>
                            <input
                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                className={classes.input}
                                id="input-file"
                                type="file"
                                onChange={(e) => e.target?.files && onUpload(e.target.files[0])}/>
                            <label htmlFor="input-file">
                                <Button variant="contained"
                                        size="large"
                                        color="primary"
                                        fullWidth
                                        component="span"
                                        startIcon={<CloudUploadOutlined/>}
                                >{t('action_upload')}</Button>
                            </label>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
            <AlertSnackbar severity="success" {...success} />
            <AlertSnackbar {...error} />
        </Track>
    )
}

export default withStyles(styles)(withTranslation()(Upload));
