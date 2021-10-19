import InfoOutlined from "@mui/icons-material/InfoOutlined";
import {Container, Grid, Paper} from "@mui/material";
import {blue, green, red, yellow} from "@mui/material/colors";
import {Chart, ChartData, ChartOptions, LegendItem} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {isPast, isValid} from "date-fns";
import React, {useEffect} from 'react';
import {Bar, Pie} from "react-chartjs-2";
import {useTranslation} from "react-i18next";
import {Redirect, useLocation} from "react-router-dom";
import {PrivateRouteProps} from "./App";
import {useParsedDate} from "./common/Date";
import {InfoDialog, Lorem, useInfoDialog} from "./common/InfoDialog";
import ResponsiveIconButton from "./common/ResponsiveIconButton";
import useDefaultTracking from "./common/Tracking";

const barChartData: ChartData = {
    labels: ['Ihr Stromverbrauch', 'Durchschnittlicher Stromverbrauch der anderen'],
    datasets: [
        {
            data: [15, 10],
            backgroundColor: [red["500"], blue["500"]],
            barPercentage: 0.9,
            categoryPercentage: 0.9
        },
    ],
};

const pieChartData: ChartData = {
    labels: ['Viel Strom', 'Durchschnittlicher Strom', 'Wenig Strom'],
    datasets: [
        {
            data: [40, 35, 25],
            backgroundColor: [green["500"], yellow["500"], red["500"]],
            barPercentage: 0.9,
            categoryPercentage: 0.9
        },
    ],
};


const options: ChartOptions = {
    scales: {
        xAxis: {
            ticks: {
                display: false
            },
            grid: {
                display: false
            }
        },
        yAxis: {
            display: false,
        }
    },
    plugins: {
        legend: {
            display: true,
            position: 'bottom',
            labels: {
                generateLabels(chart: Chart): LegendItem[] {
                    const colors = chart.data.datasets[0].backgroundColor as string[];
                    return chart.data.labels?.map((value: any, index) => ({
                        datasetIndex: index,
                        fillStyle: colors[index],
                        strokeStyle: "#efefef",
                        text: value
                    })) || []
                }
            }
        },
        tooltip: {
            enabled: false
        },
        datalabels: {
            color: 'black',
            formatter: (value, context) => value + " kWh"
        }
    }
}

const barChartOptions: ChartOptions = {
    scales: {
        xAxis: {
            ticks: {
                display: false
            },
            grid: {
                display: false
            }
        },
        yAxis: {
            display: false,
        }
    },
    plugins: {
        legend: {position: 'bottom'},
        tooltip: {enabled: false},
        datalabels: {
            color: 'black',
            formatter: (value, context) => value + "%"
        }
    }
}

function Feedback(props: PrivateRouteProps) {
    const {Track} = useDefaultTracking({page: 'Feedback'});
    const {t} = useTranslation()
    const [infoProps, openInfo] = useInfoDialog();
    const query = new URLSearchParams(useLocation().search);
    const date = query.get("date")!;
    const dateParsed = useParsedDate(date);
    const validDate = isValid(dateParsed) && isPast(dateParsed);
    const {setAppBar} = props;

    useEffect(() => {
        setAppBar({
            title: t('card_behavior_full_title', {date: dateParsed}),
            showBackButton: true,
            children: () => <ResponsiveIconButton icon={<InfoOutlined/>} onClick={openInfo} description={t('info')}/>
        })
    }, [dateParsed, t, setAppBar, openInfo])

    if (!validDate) return <Redirect to={'/'}/>

    return <Track>
        <Container maxWidth="lg" sx={{paddingTop: 1}}>
            <Grid container spacing={1}>
                <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{p: 2, height: "100%", display: "flex", alignItems: "flex-end"}}>
                        <Bar plugins={[ChartDataLabels]} data={barChartData} options={options} height={200}/>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{p: 2, height: "100%", display: "flex", alignItems: "flex-end"}}>
                        <Pie plugins={[ChartDataLabels]} data={pieChartData} options={barChartOptions}/>
                    </Paper>
                </Grid>
            </Grid>


        </Container>
        <InfoDialog title={t('info')} content={<Lorem/>} {...infoProps} />
    </Track>
}

export default Feedback;