import React from 'react';
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

class Login extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            shared_password: '',
            email: ''
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        this.props.backendService
            .requestPin(this.state.shared_password, this.state.email)
            .then(() => {
                this.props.history.push('/verify', {email: this.state.email})
            })
            .catch((error) => {
                console.log(error.response)
            })
    }

    render() {
        const {classes, t} = this.props;
        return (
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
                            <form onSubmit={this.handleSubmit}>
                                <TextField
                                    autoFocus
                                    id="shared_password"
                                    label={t('login_shared_password')}
                                    variant="outlined"
                                    margin="normal"
                                    value={this.state.shared_password}
                                    onChange={(e) => this.setState({shared_password: e.target.value})}
                                    required
                                    fullWidth
                                />
                                <TextField
                                    autoComplete="email"
                                    id="email"
                                    label={t('login_email_address')}
                                    variant="outlined"
                                    margin="normal"
                                    value={this.state.email}
                                    onChange={(e) => this.setState({email: e.target.value})}
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
        );
    }
}

export default withRouter(withStyles(styles)(withTranslation()(Login)));
