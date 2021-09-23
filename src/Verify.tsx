import React, {useEffect, useState} from 'react';
import { Avatar, Button, Container, TextField, Theme, Typography } from "@mui/material";
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import {RouteComponentProps} from "react-router-dom";
import BackendService from "./service/BackendService";
import {withRouter} from "react-router";
import {withTranslation, WithTranslation} from "react-i18next";
import {AlertSnackbar} from "./common/AlertSnackbar";
import {useSnackBar} from "./common/UseSnackBar";

const styles = ({palette, spacing}: Theme) => createStyles({
    paper: {
        marginTop: spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: spacing(1),
        backgroundColor: palette.secondary.main,
    },
    form: {
        width: '100%',
        marginTop: spacing(1),
    },
    submit: {
        margin: spacing(3, 0, 2),
    },
});

interface Props extends WithStyles<typeof styles>, RouteComponentProps, WithTranslation {
    backendService: BackendService
}

interface State {
    email?: string
    password: string
}

function Verify(props: Props) {
    const [state, setState] = useState<State>({password: ''})
    const [error, setError] = useSnackBar()
    const {location, history, backendService, classes, t} = props;

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
        <>
            <Container component="main" maxWidth="sm">
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}/>
                    <Typography component="h1" variant="h5">{t('verify_title')}</Typography>
                    <form className={classes.form} onSubmit={handleSubmit}>
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
                        <Button type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}>{t('verify_login')}</Button>
                    </form>
                </div>
            </Container>
            <AlertSnackbar {...error}/>
        </>
    );
}

export default withRouter(withStyles(styles)(withTranslation()(Verify)));
