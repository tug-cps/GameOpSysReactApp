import {InfoOutlined, LanguageOutlined} from "@mui/icons-material";
import {LoadingButton} from "@mui/lab";
import {
    Avatar,
    Box,
    Container,
    DialogContentText,
    Fab,
    Grid,
    IconButton,
    InputAdornment,
    Link,
    List,
    ListItemButton,
    ListItemText,
    TextField,
    Typography
} from "@mui/material";
import {styled} from "@mui/system";
import React, {useCallback, useState} from 'react';
import {useTranslation} from "react-i18next";
import {useHistory} from 'react-router-dom';
import {AlertSnackbar} from "./common/AlertSnackbar";
import {InfoDialog, useInfoDialog} from "./common/InfoDialog";
import {ResponsiveDialog} from "./common/ResponsiveDialog";
import {useSnackBar} from "./common/UseSnackBar";
import BackendService from "./service/BackendService";


interface Props {
    backendService: BackendService
}

const StyledGrid = styled(Grid)({
    margin: 2,
    padding: 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
})

function ChangeLanguageDialog(props: {
    open: boolean
    onClose: () => void
}) {
    const {t, i18n} = useTranslation();
    const changeLanguage = React.useCallback((language: string) =>
            i18n.changeLanguage(language)
                .catch(console.log)
                .finally(() => props.onClose())
        , [i18n, props])
    return <ResponsiveDialog title={t('change_language')} {...props}>
        <List sx={{pt: 0}}>
            <ListItemButton onClick={() => changeLanguage('en')}>
                <ListItemText primary={t('lang_english')}/>
            </ListItemButton>
            <ListItemButton onClick={() => changeLanguage('de')}>
                <ListItemText primary={t('lang_german')}/>
            </ListItemButton>
        </List>
    </ResponsiveDialog>
}

function Login(props: Props) {
    const [personalCode, setPersonalCode] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useSnackBar();
    const {t} = useTranslation();
    const history = useHistory();
    const {backendService} = props;
    const [langDialogProps, openLangDialog] = useInfoDialog();
    const [infoProps, openInfo] = useInfoDialog();
    const [progress, setProgress] = useState(false);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        setProgress(true);
        backendService.requestPin(personalCode, email)
            .then(
                () => history.push('/verify', {email: email}),
                (e) => {
                    setError(e);
                    setProgress(false);
                })
            .catch()
    }, [backendService, history, setError, email, personalCode]);

    const InfoDialogContent = () => {
        const infoText = t('info_personal_code', {returnObjects: true}) as string[];
        return <>{infoText.map(text => <DialogContentText children={text}/>)}</>
    }

    const InfoLogin = () => {
        const text = t('info_login', {returnObjects: true}) as string[]
        const link = t('info_login_link')
        return <>
            {text.map(v => v ? <Typography>{v}</Typography> : <Box py={1}/>)}
            <Link component="a" href={link} children={link}/>
        </>
    }

    const InfoPersonalCode = () => {
        const infoText = t('info_personal_code', {returnObjects: true}) as string[];
        return <>{infoText.map(text => <Typography children={text}/>)}</>
    }

    return (
        <>
            <Container maxWidth="lg" sx={{pt: 5}}>
                <Box>
                    <Grid container spacing={2}>
                        <StyledGrid item xs={12} md>
                            <Typography paragraph component="h1" variant="h2">ANSERS</Typography>
                            <Typography component="h2" variant="h5">{t('login_welcome')}</Typography>
                            <Box pt={8}>
                                <InfoLogin/>
                                <Box py={2}/>
                                <Typography>{t('info_login2')}</Typography>
                                <Box py={2}/>
                                <InfoPersonalCode/>
                            </Box>
                        </StyledGrid>
                        <StyledGrid item xs={12} md sx={{minHeight: 400}}>
                            <Avatar sx={{margin: '1px', backgroundColor: 'secondary.main'}}/>
                            <Typography component="h1" variant="h5">{t('login_sign_in')}</Typography>
                            <form onSubmit={handleSubmit}>
                                <TextField
                                    autoFocus
                                    autoComplete="email"
                                    disabled={progress}
                                    id="email"
                                    label={t('login_email_address')}
                                    variant="outlined"
                                    margin="normal"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    fullWidth
                                />
                                <TextField
                                    id="shared_password"
                                    disabled={progress}
                                    label={t('login_shared_password')}
                                    variant="outlined"
                                    margin="normal"
                                    value={personalCode}
                                    onChange={e => setPersonalCode(e.target.value)}
                                    required
                                    fullWidth
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={openInfo}>
                                                    <InfoOutlined color="inherit"/>
                                                </IconButton>
                                            </InputAdornment>),
                                    }}
                                />
                                <LoadingButton
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    sx={{marginTop: 1}}
                                    loading={progress}
                                    children={t('login_submit')}
                                />
                            </form>
                        </StyledGrid>
                    </Grid>
                </Box>
            </Container>
            <Fab variant="extended"
                 title={t('change_language')}
                 color="primary"
                 size="medium"
                 onClick={openLangDialog}><LanguageOutlined sx={{mr: 1}}/>ENG / DEU</Fab>
            <ChangeLanguageDialog {...langDialogProps}/>
            <InfoDialog title={t('info')} content={<InfoDialogContent/>} {...infoProps}/>
            <AlertSnackbar {...error} />
        </>
    )
}

export default Login;
