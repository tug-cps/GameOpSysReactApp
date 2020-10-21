import React from 'react';
import {
    Card,
    CardActionArea,
    CardContent,
    Container,
    createStyles,
    Theme,
    Typography,
    WithStyles
} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import {apiClient, UserPredictionModel} from "./common/ApiClient";
import DefaultAppBar from "./common/DefaultAppBar";

class ArchiveEntry extends React.Component<{ date: string }, { predictions: UserPredictionModel[] }> {
    constructor(props: any) {
        super(props);
        this.state = {
            predictions: []
        }
    }

    componentDidMount() {
        apiClient.getPrediction(this.props.date).then((prediction) => this.setState({predictions: prediction}))
    }

    render() {
        const {date} = this.props;
        const {predictions} = this.state;
        return (
            <Card variant="outlined">
                <CardActionArea>
                    <CardContent>
                        <Typography variant="h6">{date}</Typography>
                        {predictions.map((prediction) => {
                            return (
                                <Typography variant="body1" key={prediction.consumerId}>
                                    {prediction.data.map((v) => v ? '█' : '░')}
                                </Typography>
                            );
                        })}
                    </CardContent>
                </CardActionArea>
            </Card>
        )
    }
}

const styles = ({spacing}: Theme) => createStyles({
    root: {
        flexGrow: 1,
    },
    card: {
        marginTop: spacing(2)
    },
});


interface Props extends WithStyles<typeof styles> {
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
                <DefaultAppBar title='Predictions'/>
                <Container maxWidth="md">
                    {this.state.dates.map((value) => {
                        return (<ArchiveEntry date={value} key={value}/>)
                    })}
                </Container>
            </div>
        )
    }
}

export default withStyles(styles)(Archive);
