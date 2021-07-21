import React from 'react';
import {Avatar, Button, Container, createStyles, TextField, Theme, Typography, WithStyles} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import {RouteComponentProps} from 'react-router-dom';
import BackendService from "./service/BackendService";
import {withRouter} from "react-router";

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

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
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
            .then(() => {this.props.history.push('/verify', {email: this.state.email})})
            .catch((error) => {console.log(error.response)})
    }

    render() {
        const {classes} = this.props;
        return (
            <Container component="main" maxWidth="xs">
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}/>
                    <Typography component="h1" variant="h5">Sign in</Typography>
                    <form className={classes.form} onSubmit={this.handleSubmit}>
                        <TextField
                            id="shared_password"
                            label="Shared password"
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
                            label="Email address"
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
                            Send verification code
                        </Button>
                    </form>
                </div>
            </Container>
        );
    }
}

export default withRouter(withStyles(styles)(Login));
