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
import {apiClient} from "./common/ApiClient";
import {Chart, LineAdvance} from "bizcharts";
import DefaultAppBar from "./common/DefaultAppBar";

interface EntryProps {
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
        apiClient.getProcessedConsumption(this.props.date).then((consumptions) => {
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
        apiClient.getProcessedConsumptions().then((response) => this.setState({dates: response}));
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
                                        <PowerEntry date={value}/>
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
