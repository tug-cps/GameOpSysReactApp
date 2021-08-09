import React from 'react';
import {Card, CardContent, Container, createStyles, Theme, Typography, WithStyles} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import DefaultAppBar from "./common/DefaultAppBar";
import BackendService from "./service/BackendService";
import {Line} from "react-chartjs-2";
import {ChartOptions} from "chart.js";

interface EntryProps {
    backendService: BackendService;
    date: string;
}

interface EntryState {
    data: any;
}

const options: ChartOptions = {
    animation: false
};

class PowerEntry extends React.Component<EntryProps, EntryState> {
    constructor(props: Readonly<EntryProps>) {
        super(props);
        this.state = {
            data: {}
        }
    }

    componentDidMount() {
        const {backendService, date} = this.props;
        backendService.getProcessedConsumption(date)
            .then((consumptions) => {
                this.setState({
                    data: {
                        labels: Array.from(Array(24).keys()),
                        datasets: consumptions.map((c) => ({
                                label: c.type,
                                data: c.data,
                                fill: false,
                                backgroundColor: (c.type === 'actual') ? 'rgb(255, 99, 132)' : 'green',
                                borderColor: 'rgba(255, 99, 132, 0.2)',
                            })
                        )
                    }
                })
            })
            .catch(console.log)
    }

    render() {
        const {data} = this.state;
        console.log(data)
        return (
            <Line data={data} options={options}/>
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
        const {classes, backendService} = this.props;
        const {dates} = this.state;
        return (
            <div className={classes.root}>
                <DefaultAppBar title='Power'/>
                <Container maxWidth="md">
                    {dates.map((value) => {
                        return (
                            <Card variant="outlined" key={value} className={classes.card}>
                                <CardContent>
                                    <Typography variant="h6">{value}</Typography>
                                    {
                                        <PowerEntry date={value} backendService={backendService}/>
                                    }
                                </CardContent>
                            </Card>
                        )
                    })}
                </Container>
            </div>
        )
    }
}

export default withStyles(styles)(Power);
