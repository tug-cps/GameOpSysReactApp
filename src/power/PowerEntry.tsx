import {ChartOptions} from "chart.js";
import React, {useEffect, useState} from "react";
import {Line} from "react-chartjs-2";
import BackendService from "../service/BackendService";
import {Card, CardContent, CardHeader} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useParsedDate} from "../common/Date";

interface Props {
    backendService: BackendService;
    date: string;
}

const options: ChartOptions = {
    animation: false
};

export function PowerEntry(props: Props) {
    const {backendService, date} = props;
    const dateParsed = useParsedDate(date);
    const {t} = useTranslation();
    const [data, setData] = useState<any>();
    useEffect(() => {
        backendService.getProcessedConsumption(date)
            .then((consumptions) => {
                setData({
                    labels: Array.from(Array(24).keys()),
                    datasets: consumptions.map((c) => ({
                            label: c.type,
                            data: c.data,
                            fill: false,
                            backgroundColor: (c.type === 'actual') ? 'rgb(255, 99, 132)' : 'green',
                            borderColor: 'rgba(255, 99, 132, 0.2)',
                        })
                    )
                })
            })
            .catch(console.log)
    }, [backendService, date]);

    return (
        <Card variant="outlined" key={date}>
            <CardHeader title={t('archive_entry_date', {date: dateParsed})}/>
            <CardContent>
                <Line data={data} options={options}/>
            </CardContent>
        </Card>
    )
}