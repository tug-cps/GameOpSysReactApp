import React from 'react';
import {
    AppBar,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Container,
    createStyles,
    CssBaseline,
    Grid,
    IconButton,
    Theme,
    Toolbar,
    Typography,
    WithStyles
} from "@material-ui/core";
import {Link, RouteComponentProps} from 'react-router-dom';
import Icon from "@material-ui/core/Icon";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import {withStyles} from "@material-ui/core/styles";
import {apiClient, UserModel} from "./ApiClient";
import * as crypto from 'crypto';

const styles = (theme: Theme) => createStyles({
    card: {
        borderColor: theme.palette.secondary.main,
    },
    root: {
        flexGrow: 1,
    },
    media: {
        minHeight: 120,
        backgroundColor: theme.palette.secondary.main,
    },
    largeIcon: {
        fontSize: "8em",
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
});

interface Item {
    title: string;
    destination: string;
}

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
}

interface State {
    items: Item[]
}

function createItems(user: UserModel): Item[] {
    let group = user.treatmentGroup;
    let emailHash = crypto.createHash('md5').update(user.email).digest("hex");

    return [
        {
            title: 'Survey 1',
            destination: `https://ww3.unipark.de/uc/SOZPSY/7a37/?a=${emailHash}&b=${group}`,
        },
        {
            title: 'Final survey',
            destination: `https://ww3.unipark.de/uc/SOZPSY/96f2/?a=${emailHash}&b=${group}`,
        },
    ];
}

class Survey extends React.Component<Props, State> {

    constructor(props: Readonly<Props>) {
        super(props);
        this.state = {
            items: []
        }
    }

    componentDidMount() {
        apiClient.getUser().then((user) => this.setState({items: createItems(user)}))
    }

    render() {
        const {classes} = this.props;

        function createCard(item: Item) {
            return (
                <Grid item xs={6} xl={4} key={item.destination}>
                    <Card variant="outlined" className={classes.card}>
                        <CardActionArea>
                            <Link to={item.destination}>
                                <CardMedia className={classes.media}>
                                    <Typography align='center'>
                                        <Icon className={classes.largeIcon} style={{color: '#fff'}}>assignment</Icon>
                                    </Typography>
                                </CardMedia>
                                <CardContent>
                                    <Typography variant="h6">{item.title}</Typography>
                                    <Typography color="textSecondary" noWrap>Please fill out this survey</Typography>
                                </CardContent>
                            </Link>
                        </CardActionArea>
                    </Card>
                </Grid>
            )
        }

        return (
            <React.Fragment>
                <AppBar position="sticky">
                    <Toolbar>
                        <IconButton
                            edge="start"
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="back"
                            onClick={() => this.props.history.go(-1)}
                        >
                            <ArrowBackIcon/>
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>Surveys</Typography>
                    </Toolbar>
                </AppBar>
                <Container component="main" maxWidth="lg" disableGutters>
                    <CssBaseline/>
                    <Grid container spacing={1}>
                        {this.state.items.map(createCard)}
                    </Grid>
                </Container>
            </React.Fragment>

        );
    }
}

export default withStyles(styles)(Survey);
