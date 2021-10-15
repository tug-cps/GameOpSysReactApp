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
    margin: 2,
    padding: 8,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh'
})

function Verify(props: Props) {
    const [password, setPassword] = useState<string>('')
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
        backendService.login(email, password)
            .then(() => history.push('/'), setError)
            .catch(console.log)
            .finally(() => setProgress(false))
    }, [backendService, email, history, password, setError]);

    const handleChange = useCallback(e => setPassword(e.target.value), []);

    if (!email) return <Redirect to={'/'}/>
    return (
        (<>
            <Container component="main" maxWidth="sm">
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
                            value={password}
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
