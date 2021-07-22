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
import {Chart, LineAdvance} from "bizcharts";
import DefaultAppBar from "./common/DefaultAppBar";
import BackendService from "./service/BackendService";

interface EntryProps {
    backendService: BackendService;
    date: string;
}

interface ChartData {
    type: string;
    time: number;
    value: number;
}

interface EntryState {
    data: ChartData[]
}

class PowerEntry extends React.Component<EntryProps, EntryState> {
    constructor(props: Readonly<EntryProps>) {
        super(props);
        this.state = {
            data: []
        }
    }

    componentDidMount() {
        this.props.backendService.getProcessedConsumption(this.props.date).then((consumptions) => {
            this.setState({
                data: consumptions.map((c) => {
                    return c.data.map((value, idx) => {
                        return {type: c.type, time: idx, value: value}
                    })
                }).flat()
            })
        })
    }

    render() {
        const {data} = this.state;
        return (
            <Chart height={300} autoFit data={data}>
                <LineAdvance
                    shape="smooth"
                    point
                    area
                    position="time*value"
                    color="type"
                />
            </Chart>
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
    backendService: BackendService
}

interface State {
    dates: string[]
}

class Power extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            dates: []
        };
    }

    componentDidMount() {
        const {backendService} = this.props;
        backendService.getProcessedConsumptions()
            .then((response) => this.setState({dates: response}))
            .catch((reason) => console.log(reason))
    }

    render() {
        const {classes} = this.props;
        const {dates} = this.state;
        return (
            <div className={classes.root}>
                <DefaultAppBar title='Power'/>
                <Container maxWidth="md">
                    {dates.map((value) => {
                        return (
                            <Card variant="outlined" key={value} className={classes.card}>
                                <CardActionArea>
                                    <CardContent>
                                        <Typography variant="h6">{value}</Typography>
                                        <PowerEntry date={value} backendService={this.props.backendService}/>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        )
                    })}
                </Container>
            </div>
        )
    }
}

export default withStyles(styles)(Power);
