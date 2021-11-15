import {ElectricalServicesOutlined, LaunchOutlined} from "@mui/icons-material";
import CloudUploadOutlined from "@mui/icons-material/CloudUploadOutlined";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import {LoadingButton} from "@mui/lab";
import {
    Box,
    Button,
    Collapse,
    Container,
    DialogContentText,
    Grid,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Stack,
    Typography
} from "@mui/material";
import {styled} from '@mui/system';
import {CancelTokenSource} from "axios";
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {PrivateRouteProps} from "./App";
import {AlertSnackbar} from "./common/AlertSnackbar";
import {InfoDialog, useInfoDialog} from "./common/InfoDialog";
import ResponsiveIconButton from "./common/ResponsiveIconButton";
import useDefaultTracking from "./common/Tracking";
import {useSnackBar} from "./common/UseSnackBar";


const Input = styled('input')({
    display: 'none',
});

const operators = [
    {name: 'Stromnetz Graz', link: 'https://webportal.stromnetz-graz.at/'},
]

interface Props extends PrivateRouteProps {
}

function Upload(props: Props) {
    const {Track} = useDefaultTracking({page: 'Upload'});
    const [success, setSuccess] = useSnackBar();
    const [error, setError] = useSnackBar();
    const {t} = useTranslation();
    const {backendService, setAppBar} = props;
    const [infoProps, openInfo] = useInfoDialog();
    const [cancelToken, setCancelToken] = useState<CancelTokenSource | undefined>();
    const progress = !!cancelToken;

    const onUpload = useCallback((file: File) => {
        if (progress) return;
        const {promise, cancelToken} = backendService.postConsumption(file);
        setCancelToken(cancelToken);
        promise.then(() => setSuccess(t('file_upload_success')), setError)
            .finally(() => setCancelToken(undefined))
            .catch(console.log);
    }, [progress, backendService, setSuccess, setError, t])

    const onCancel = useCallback(() => {
        setCancelToken(prevState => {
            prevState?.cancel();
            return undefined;
        });
    }, [])

    useEffect(() => setAppBar({
        title: t('card_upload_title'),
        showBackButton: false,
        children: () => <ResponsiveIconButton description={t('info')} icon={<InfoOutlined/>} onClick={openInfo}/>
    }), [t, setAppBar, openInfo])

    const infoText = t('info_upload', {returnObjects: true}) as string[];
    const infoContent = <>{infoText.map(text => <DialogContentText paragraph children={text}/>)}</>

    return (
        <Track>
            <Container maxWidth="md" sx={{paddingTop: 1}}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h5" gutterBottom>{t('upload_title_download')}</Typography>
                        <Typography color="text.secondary" paragraph>{t('upload_instruction_download')}</Typography>
                        <Paper>
                            <List>
                                <li>
                                    <Typography
                                        sx={{mt: 0.5, ml: 2}}
                                        color="text.secondary"
                                        display="block"
                                        variant="caption">{t('network_operators')}</Typography>
                                </li>
                                {operators.map(item =>
                                    <ListItemButton key={item.name} component="a" href={item.link} target="_blank">
                                        <ListItemAvatar><ElectricalServicesOutlined/></ListItemAvatar>
                                        <ListItemText primary={item.name}/>
                                        <ListItemIcon><LaunchOutlined/></ListItemIcon>
                                    </ListItemButton>)
                                }
                            </List>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h5" gutterBottom>{t('upload_title_upload')}</Typography>
                        <Typography color="text.secondary" paragraph>{t('upload_instruction_upload')}</Typography>
                        <Stack direction="row" spacing={1}>
                            <Box sx={{flexGrow: 1}}>
                                <label htmlFor="contained-button-file">
                                    <Input
                                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                        id="contained-button-file"
                                        type="file"
                                        onChange={(e) => e.target?.files && onUpload(e.target.files[0])}
                                    />
                                    <LoadingButton
                                        loading={progress}
                                        fullWidth
                                        size="large"
                                        variant="contained"
                                        component="span"
                                        loadingPosition="start"
                                        startIcon={<CloudUploadOutlined/>}
                                    >{t('action_upload')}</LoadingButton>
                                </label>
                            </Box>
                            <Collapse in={progress} orientation="horizontal">
                                <Button size="large" onClick={onCancel}>{t('cancel')}</Button>
                            </Collapse>
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
            <InfoDialog title={t('info')} content={infoContent} {...infoProps} />
            <AlertSnackbar severity="success" {...success} />
            <AlertSnackbar {...error} />
        </Track>
    );
}

export default Upload;
