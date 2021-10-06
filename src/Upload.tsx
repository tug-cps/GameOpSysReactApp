import {ElectricalServicesOutlined} from "@mui/icons-material";
import CloudUploadOutlined from "@mui/icons-material/CloudUploadOutlined";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import {
    Box,
    Button,
    Container,
    Divider,
    Grid,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Paper,
    Typography
} from "@mui/material";
import {styled} from '@mui/system';
import React, {useEffect} from 'react';
import {useTranslation} from "react-i18next";
import {PrivateRouteProps} from "./App";
import {AlertSnackbar} from "./common/AlertSnackbar";
import {InfoDialog, Lorem, useInfoDialog} from "./common/InfoDialog";
import {ResponsiveIconButton} from "./common/ResponsiveIconButton";
import useDefaultTracking from "./common/Tracking";
import {useSnackBar} from "./common/UseSnackBar";


const Input = styled('input')({
    display: 'none',
});

const operators = [
    {name: 'Energienetze Steiermark', link: 'https://portal.e-netze.at/'},
    {name: 'Kelag', link: 'https://services.kelag.at/ISS/Services.aspx'},
    {name: 'Stromnetz Graz', link: 'https://webportal.stromnetz-graz.at/'},
]

const providers = [
    {name: 'Energie Graz', link: 'https://portal.energie-graz.at/'},
    {name: 'Energie Steiermark', link: 'https://portal.energie-graz.at/'},
    {name: 'Verbund', link: 'https://www.verbund.at/login'},
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
                            <Typography color="text.secondary" paragraph>{t('upload_instruction_download')}</Typography>
                            <Paper>
                                <List>
                                    <li>
                                        <Typography
                                            sx={{mt: 0.5, ml: 2}}
                                            color="text.secondary"
                                            display="block"
                                            variant="caption">Network operators</Typography>
                                    </li>
                                    {operators.map(item =>
                                        <ListItemButton key={item.name} component="a" href={item.link} target="_blank">
                                            <ListItemAvatar><ElectricalServicesOutlined/></ListItemAvatar>
                                            <ListItemText primary={item.name}/>
                                        </ListItemButton>)
                                    }
                                    <Divider component="li"/>
                                    <li>
                                        <Typography
                                            sx={{mt: 0.5, ml: 2}}
                                            color="text.secondary"
                                            display="block"
                                            variant="caption">Energy providers</Typography>
                                    </li>
                                    {providers.map(item =>
                                        <ListItemButton key={item.name} component="a" href={item.link} target="_blank">
                                            <ListItemAvatar><ElectricalServicesOutlined/></ListItemAvatar>
                                            <ListItemText primary={item.name}/>
                                        </ListItemButton>)
                                    }

                                </List>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h5" gutterBottom>{t('upload_title_upload')}</Typography>
                            <Typography color="text.secondary" paragraph>{t('upload_instruction_upload')}</Typography>
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

export default Upload;
