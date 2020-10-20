import React from 'react';
import {
    AppBar,
    Card,
    CardActionArea,
    CardContent,
    Container,
    createStyles,
    IconButton,
    Theme,
    Toolbar,
    Typography,
    WithStyles
} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {Link, RouteComponentProps} from "react-router-dom";
import {apiClient, UserPredictionModel} from "./ApiClient";

interface EntryProps {
    date: string;
}

interface EntryState {
    predictions: UserPredictionModel[];
}

class ArchiveEntry extends React.Component<EntryProps, EntryState> {
    constructor(props: Readonly<EntryProps>) {
        super(props);
        this.state = {
            predictions: []
        }
    }

    componentDidMount() {
        apiClient.getPrediction(this.props.date).then((prediction) => this.setState({predictions: prediction}))
    }

    render() {
        return (
            <Card variant="outlined">
                <CardActionArea>
                    <Link to={'/archive/' + this.props.date}>
                        <CardContent>
                            <Typography variant="h6">{this.props.date}</Typography>
                            {this.state.predictions.map((prediction) => {
                                return (
                                    <Typography variant="body1">
                                        {prediction.data.map((v) => v ? '█' : '░')}
                                    </Typography>
                                );
                            })}
                        </CardContent>
                    </Link>
                </CardActionArea>
            </Card>
        )
    }
}

const styles = ({spacing}: Theme) => createStyles({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    card: {
        marginTop: spacing(2)
    },
});

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
}

interface State {
    dates: string[]
}

class Archive extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            dates: []
        };
    }

    componentDidMount() {
        apiClient.getPredictions().then((response) => this.setState({dates: response}));
    }

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
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
                        <Typography variant="h6" className={classes.title}>Predictions</Typography>
                    </Toolbar>
                </AppBar>
                <Container maxWidth="md">
                    {this.state.dates.map((value, index) => {
                        return (<ArchiveEntry date={value} key={value}/>)
                    })}
                </Container>
            </div>
        )
    }
}

export default withStyles(styles)(Archive);
