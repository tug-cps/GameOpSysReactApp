import {ChartOptions} from "chart.js";
import React from "react";
import {Line} from "react-chartjs-2";
import BackendService from "../service/BackendService";

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

export class PowerEntry extends React.Component<EntryProps, EntryState> {
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