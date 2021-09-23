import {Avatar, Box, Button, Container, Grid, TextField, Typography} from "@mui/material";
import {styled} from "@mui/system";
import React, {useState} from 'react';
import {withTranslation, WithTranslation} from "react-i18next";
import {withRouter} from "react-router";
import {RouteComponentProps} from 'react-router-dom';
import {AlertSnackbar} from "./common/AlertSnackbar";
import {useSnackBar} from "./common/UseSnackBar";
import BackendService from "./service/BackendService";

interface Props extends RouteComponentProps, WithTranslation {
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
    const {t, backendService, history} = props;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        backendService.requestPin(state.shared_password, state.email)
            .then(() => history.push('/verify', {email: state.email}))
            .catch(setError)
    }

    return (
        (<>
            <Box sx={{display: 'flex', alignItems: 'center', height: '100vh'}}>
                <Container maxWidth="lg">
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
                                    id="shared_password"
                                    label={t('login_shared_password')}
                                    variant="outlined"
                                    margin="normal"
                                    value={state.shared_password}
                                    onChange={(e) => setState({...state, shared_password: e.target.value})}
                                    required
                                    fullWidth
                                />
                                <TextField
                                    autoComplete="email"
                                    id="email"
                                    label={t('login_email_address')}
                                    variant="outlined"
                                    margin="normal"
                                    value={state.email}
                                    onChange={(e) => setState({...state, email: e.target.value})}
                                    required
                                    fullWidth
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    sx={{marginTop: 1}}
                                >
                                    {t('login_submit')}
                                </Button>
                            </form>
                        </StyledGrid>
                    </Grid>
                </Container>
            </Box>
            <AlertSnackbar {...error} />
        </>)
    );
}

export default withRouter((withTranslation()(Login)));
