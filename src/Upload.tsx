import CloudUploadOutlined from "@mui/icons-material/CloudUploadOutlined";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import {Box, Button, Container, Grid, Link, List, ListItem, Typography} from "@mui/material";
import {styled} from '@mui/system';
import React, {useEffect} from 'react';
import {useTranslation, WithTranslation, withTranslation} from "react-i18next";
import {PrivateRouteProps} from "./App";
import {AlertSnackbar} from "./common/AlertSnackbar";
import {InfoDialog, Lorem, useInfoDialog} from "./common/InfoDialog";
import {ResponsiveIconButton} from "./common/ResponsiveIconButton";
import useDefaultTracking from "./common/Tracking";
import {useSnackBar} from "./common/UseSnackBar";


const Input = styled('input')({
    display: 'none',
});

interface Operator {
    name: string;
    link: string;
}

const operators: Operator[] = [
    {name: 'Netz Oberösterreich', link: 'https://netz-online.netzgmbh.at/eServiceWeb/main.html'},
    {name: 'Netz Burgenland', link: 'https://smartmeter.netzburgenland.at'},
    {name: 'Kärnten Netz', link: 'https://meinportal.kaerntennetz.at/meinPortal/Login.aspx?service=verbrauch'},
]

interface Props extends PrivateRouteProps, WithTranslation {
}

function Upload(props: Props) {
    const {Track} = useDefaultTracking({page: 'Upload'});
    const [success, setSuccess] = useSnackBar();
    const [error, setError] = useSnackBar();
    const {t} = useTranslation();
    const {backendService, setAppBar} = props;
    const [infoProps, openInfo] = useInfoDialog();

    const onUpload = (file: File) => {
        backendService.postConsumption(file)
            .then(() => {
                console.log("File uploaded.")
                setSuccess("File uploaded");
            }, setError)
            .catch(console.log);
    }

    useEffect(() => setAppBar({
        title: t('card_upload_title'),
        showBackButton: false,
        children: () => <>
            <ResponsiveIconButton description={t('info')} icon={<InfoOutlined/>} onClick={openInfo}/>
        </>
    }), [t, setAppBar, openInfo])

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
                            <label htmlFor="contained-button-file">
                                <Input
                                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                    id="contained-button-file"
                                    type="file"
                                    onChange={(e) => e.target?.files && onUpload(e.target.files[0])}
                                />
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
            <InfoDialog title={t('info')} content={<Lorem/>} {...infoProps} />
            <AlertSnackbar severity="success" {...success} />
            <AlertSnackbar {...error} />
        </Track>
    );
}

export default (withTranslation()(Upload));
