import React from 'react';
import {Avatar, Button, Container, createStyles, TextField, Theme, Typography, WithStyles} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import {RouteComponentProps} from "react-router-dom";
import BackendService from "./service/BackendService";
import {withRouter} from "react-router";
import {withTranslation, WithTranslation} from "react-i18next";

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

class Verify extends React.Component<Props, { email?: string, password: string }> {
    constructor(props: Props) {
        super(props);
        this.state = {password: ''};
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const {location, history} = this.props;
        if (location == null || location.state == null || location.state.email == null) {
            history.push('/')
        }
    }

    handleSubmit(e: React.FormEvent) {
        const {password} = this.state;
        const {location, history} = this.props;
        const {email} = location.state;

        e.preventDefault();
        this.props.backendService
            .login(email, password)
            .then(() => history.push('/'))
            .catch((error) => console.log(error))
    }

    render() {
        const {classes, t} = this.props;
        return (
            <Container component="main" maxWidth="sm">
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}/>
                    <Typography component="h1" variant="h5">{t('verify_title')}</Typography>
                    <form className={classes.form} onSubmit={this.handleSubmit}>
                        <TextField
                            autoFocus
                            id="otp"
                            label="Pin"
                            variant="outlined"
                            margin="normal"
                            value={this.state.password}
                            onChange={(e) => this.setState({password: e.target.value})}
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
        );
    }
}

export default withRouter(withStyles(styles)(withTranslation()(Verify)));
