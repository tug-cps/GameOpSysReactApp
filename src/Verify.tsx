import {Avatar, Container, TextField, Typography} from "@mui/material";
import {styled} from '@mui/system';
import React, {useCallback, useState} from 'react';
import {useTranslation} from "react-i18next";
import {Redirect, useHistory, useLocation} from "react-router-dom";
import {AlertSnackbar} from "./common/AlertSnackbar";
import {useSnackBar} from "./common/UseSnackBar";
import BackendService from "./service/BackendService";
import {LoadingButton} from "@mui/lab";

const Form = styled('form')({
    width: '100%',
    marginTop: 1
});

interface Props {
    backendService: BackendService
}

const StyledContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
})

function Verify(props: Props) {
    const [otp, setOtp] = useState<string>('')
    const [error, setError] = useSnackBar()
    const {t} = useTranslation();
    const location = useLocation<{ email: string }>();
    const history = useHistory();
    const [progress, setProgress] = useState(false);
    const {email} = location.state;
    const {backendService} = props;

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        setProgress(true);
        backendService.login(email, otp)
            .then(() => history.push('/'), reason => {
                setError(reason);
                setProgress(false)
            })
            .catch(console.log)
    }, [backendService, email, history, otp, setError]);

    const handleChange = useCallback(e => setOtp(e.target.value), []);

    if (!email) return <Redirect to={'/'}/>
    return (
        (<>
            <Container component="main" maxWidth="sm" sx={{pt: 5}}>
                <StyledContainer>
                    <Avatar sx={{margin: '1px', backgroundColor: 'secondary.main'}}/>
                    <Typography component="h1" variant="h5">{t('verify_title')}</Typography>
                    <Form onSubmit={handleSubmit}>
                        <TextField
                            disabled={progress}
                            autoFocus
                            id="otp"
                            label="Pin"
                            variant="outlined"
                            margin="normal"
                            value={otp}
                            onChange={handleChange}
                            required
                            fullWidth/>
                        <LoadingButton
                            loading={progress}
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{marginTop: 1}}
                        >{t('verify_login')}</LoadingButton>
                    </Form>
                </StyledContainer>
            </Container>
            <AlertSnackbar {...error}/>
        </>)
    );
}

export default Verify;
