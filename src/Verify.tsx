import {Avatar, Button, Container, TextField, Typography} from "@mui/material";
import {styled} from '@mui/material/styles';
import React, {useEffect, useState} from 'react';
import {withTranslation, WithTranslation} from "react-i18next";
import {withRouter} from "react-router";
import {RouteComponentProps} from "react-router-dom";
import {AlertSnackbar} from "./common/AlertSnackbar";
import {useSnackBar} from "./common/UseSnackBar";
import BackendService from "./service/BackendService";

const Form = styled('form')({
    width: '100%',
    marginTop: 1
});

interface Props extends RouteComponentProps, WithTranslation {
    backendService: BackendService
}

interface State {
    email?: string
    password: string
}

const StyledContainer = styled('div')({
    margin: 2,
    padding: 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
})

function Verify(props: Props) {
    const [state, setState] = useState<State>({password: ''})
    const [error, setError] = useSnackBar()
    const {location, history, backendService, t} = props;

    useEffect(() => {
        // @ts-ignore
        if (!location?.state?.email) {
            history.push('/')
        }
    }, [location, history])

    const handleSubmit = (e: React.FormEvent) => {
        const {password} = state;
        // @ts-ignore
        const {email} = location.state;

        e.preventDefault();
        backendService.login(email, password)
            .then(() => history.push('/'))
            .catch(setError)
    }

    return (
        (<>
            <Container component="main" maxWidth="sm">
                <StyledContainer>
                    <Avatar sx={{
                        margin: '1px',
                        backgroundColor: 'secondary.main',
                    }}/>
                    <Typography component="h1" variant="h5">{t('verify_title')}</Typography>
                    <Form onSubmit={handleSubmit}>
                        <TextField
                            autoFocus
                            id="otp"
                            label="Pin"
                            variant="outlined"
                            margin="normal"
                            value={state.password}
                            onChange={(e) => setState({...state, password: e.target.value})}
                            required
                            fullWidth/>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{marginTop: 1}}
                        >{t('verify_login')}</Button>
                    </Form>
                </StyledContainer>
            </Container>
            <AlertSnackbar {...error}/>
        </>)
    );
}

export default withRouter((withTranslation()(Verify)));
