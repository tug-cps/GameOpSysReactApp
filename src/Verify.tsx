import React from 'react';
import {
    Avatar,
    Button,
    Container,
    createStyles,
    TextField,
    Theme,
    Typography,
    WithStyles
} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import {apiClient} from "./common/ApiClient";
import {RouteComponentProps} from "react-router-dom";

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
}

class Login extends React.Component<Props, { password: string }> {
    constructor(props: Props) {
        super(props);
        this.state = {
            password: ''
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        apiClient.login(this.state.password).then(() => {
            this.props.history.push('/')
        })
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
                            id="otp"
                            label="Pin"
                            variant="outlined"
                            margin="normal"
                            value={this.state.password}
                            onChange={(e) => this.setState({password: e.target.value})}
                            required
                            fullWidth
                        />
                        <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>Log in</Button>
                    </form>
                </div>
            </Container>
        );
    }
}

export default withStyles(styles)(Login);
