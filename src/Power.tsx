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
import {RouteComponentProps} from "react-router-dom";
import {apiClient} from "./ApiClient";
import {Chart, LineAdvance} from "bizcharts";

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
                        return {
                            type: c.type,
                            time: idx,
                            value : value
                        }
                    })
                }).flat()
            })
        })
    }

    render() {
        return (
            <Chart height={300} autoFit data={this.state.data}>
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

const styles = ({palette, spacing}: Theme) => createStyles({
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
                        <Typography variant="h6" className={classes.title}>Power</Typography>
                    </Toolbar>
                </AppBar>
                <Container maxWidth="md">
                    {this.state.dates.map((value, index) => {
                        return (
                            <Card variant="outlined" key={value} className={classes.card}>
                                <CardActionArea href={'/power/' + value}>
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
