import {InfoOutlined} from "@mui/icons-material";
import {
    Avatar,
    Box,
    Container,
    DialogContentText,
    Grid,
    IconButton,
    InputAdornment,
    TextField,
    Typography
} from "@mui/material";
import {styled} from "@mui/system";
import React, {useCallback, useState} from 'react';
import {useTranslation} from "react-i18next";
import {useHistory} from 'react-router-dom';
import {AlertSnackbar} from "./common/AlertSnackbar";
import {useSnackBar} from "./common/UseSnackBar";
import BackendService from "./service/BackendService";
import {LoadingButton} from "@mui/lab";
import {InfoDialog, useInfoDialog} from "./common/InfoDialog";

interface Props {
    backendService: BackendService
}

interface State {
    shared_password: string;
    email: string;
}

const StyledGrid = styled(Grid)({
    margin: 2,
    padding: 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
})

function Login(props: Props) {
    const [state, setState] = useState<State>({shared_password: '', email: ''});
    const [error, setError] = useSnackBar();
    const {t} = useTranslation();
    const history = useHistory();
    const {backendService} = props;
    const [infoProps, openInfo] = useInfoDialog();
    const [progress, setProgress] = useState(false);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        setProgress(true);
        backendService.requestPin(state.shared_password, state.email)
            .then(() => history.push('/verify', {email: state.email}))
            .catch(setError)
            .finally(() => setProgress(false))
    }, [backendService, history, setError, state.email, state.shared_password]);

    const InfoContent = () => {
        const infoText = t('info_personal_code', {returnObjects: true}) as string[];
        return <>{infoText.map(text => <DialogContentText children={text}/>)}</>
    }

    return (
        (<>
            <Container maxWidth="lg">
                <Box sx={{display: 'flex', alignItems: 'center', height: '100vh'}}>
                    <Grid container spacing={2}>
                        <StyledGrid item xs={12} md>
                            <Typography paragraph component="h1" variant="h2">ANSERS</Typography>
                            <Typography component="h2" variant="h5">{t('login_welcome')}</Typography>
                        </StyledGrid>
                        <StyledGrid item xs={12} md>
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
                                    value={state.email}
                                    onChange={(e) => setState({...state, email: e.target.value})}
                                    required
                                    fullWidth
                                />
                                <TextField
                                    id="shared_password"
                                    disabled={progress}
                                    label={t('login_shared_password')}
                                    variant="outlined"
                                    margin="normal"
                                    value={state.shared_password}
                                    onChange={(e) => setState({...state, shared_password: e.target.value})}
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
                                >
                                    {t('login_submit')}
                                </LoadingButton>
                            </form>
                        </StyledGrid>
                    </Grid>
                </Box>
            </Container>
            <InfoDialog title={t('info')} content={<InfoContent/>} {...infoProps}/>
            <AlertSnackbar {...error} />
        </>)
    );
}

export default Login;
