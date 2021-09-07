import React, {useState} from 'react';
import {
    Avatar,
    Box,
    Button,
    Container,
    createStyles,
    Grid,
    TextField,
    Theme,
    Typography,
    WithStyles
} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import {RouteComponentProps} from 'react-router-dom';
import BackendService from "./service/BackendService";
import {withRouter} from "react-router";
import {withTranslation, WithTranslation} from "react-i18next";
import {AlertSnackbar} from "./common/AlertSnackbar";
import {useSnackBar} from "./common/UseSnackBar";

const styles = ({palette, spacing}: Theme) => createStyles({
    paper: {
        margin: spacing(2),
        padding: spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: spacing(1),
        backgroundColor: palette.secondary.main,
    },
    submit: {
        margin: spacing(3, 0, 2),
    },
});

interface Props extends WithStyles<typeof styles>, RouteComponentProps, WithTranslation {
    backendService: BackendService
}

interface State {
    shared_password: string;
    email: string;
}

function Login(props: Props) {
    const [state, setState] = useState<State>({shared_password: '', email: ''});
    const [error, setError] = useSnackBar();
    const {classes, t, backendService, history} = props;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        backendService.requestPin(state.shared_password, state.email)
            .then(() => history.push('/verify', {email: state.email}))
            .catch(setError)
    }

    return (
        <React.Fragment>
            <Box display="flex" alignItems="center" height="100vh">
                <Container maxWidth="lg">
                    <Grid container spacing={2}>
                        <Grid item xs={12} md className={classes.paper}>
                            <Box alignItems="center" display="flex" justifyContent="center" flexDirection="column"
                                 height="100%">
                                <Typography paragraph component="h1" variant="h2">Ansers</Typography>
                                <Typography component="h2" variant="h5">{t('login_welcome')}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md className={classes.paper}>
                            <Avatar className={classes.avatar}/>
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
                                    className={classes.submit}
                                >
                                    {t('login_submit')}
                                </Button>
                            </form>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
            <AlertSnackbar {...error} />
        </React.Fragment>
    );
}

export default withRouter(withStyles(styles)(withTranslation()(Login)));
