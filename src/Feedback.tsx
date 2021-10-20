import InfoOutlined from "@mui/icons-material/InfoOutlined";
import {Container, Grid, Paper, useTheme} from "@mui/material";
import {blue, green, red, yellow} from "@mui/material/colors";
import {ChartData, ChartOptions} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {isPast, isValid} from "date-fns";
import React, {useEffect, useMemo} from 'react';
import {Bar, Pie} from "react-chartjs-2";
import {useTranslation} from "react-i18next";
import {Redirect, useLocation} from "react-router-dom";
import {PrivateRouteProps} from "./App";
import {useParsedDate} from "./common/Date";
import {InfoDialog, Lorem, useInfoDialog} from "./common/InfoDialog";
import ResponsiveIconButton from "./common/ResponsiveIconButton";
import useDefaultTracking from "./common/Tracking";

const useBarChartData: () => ChartData = () => {
    const theme = useTheme();
    return useMemo(() => ({
        labels: ['Stromverbrauch'],
        datasets: [
            {
                label: 'Ihr Stromverbrauch',
                data: [4],
                backgroundColor: red["800"],
                borderColor: theme.palette.background.paper,
            },
            {
                label: 'Durchschnittlicher Stromverbrauch der anderen',
                data: [3.6],
                backgroundColor: blue["800"],
                borderColor: theme.palette.background.paper,
            },
        ],
    }), [theme]);
};
const usePieChartData: () => ChartData = () => {
    const theme = useTheme();
    return useMemo(() => ({
        labels: ['Viel Strom', 'Durchschnittlicher Strom', 'Wenig Strom'],
        datasets: [
            {
                data: [40, 35, 25],
                backgroundColor: [green["800"], yellow["800"], red["800"]],
                borderColor: theme.palette.background.paper,
            },
        ],
    }), [theme]);
}

const useBarChartOptions: () => ChartOptions = () => {
    const theme = useTheme();
    return useMemo(() => ({
        responsive: true,
        scales: {
            xAxis: {display: false},
            yAxis: {
                position: "right",
                grid: {
                    drawBorder: false,
                    color: theme.palette.divider
                },
                ticks: {
                    callback: tickValue => tickValue + " kWh",
                    padding: 10,
                    stepSize: 1,
                    color: theme.palette.text.primary,
                    font: {family: theme.typography.fontFamily}
                }
            },
        },
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: {family: theme.typography.fontFamily},
                    color: theme.palette.text.primary
                }
            },
            tooltip: {enabled: false},
            datalabels: {
                color: theme.palette.primary.contrastText,
                font: {
                    family: theme.typography.fontFamily,
                    size: 20,
                },
                formatter: value => value + " kWh"
            }
        }
    }), [theme]);
}
const usePieChartOptions: () => ChartOptions = () => {
    const theme = useTheme();
    return useMemo(() => ({
        responsive: true,
        scales: {
            xAxis: {display: false},
            yAxis: {display: false}
        },
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: {family: theme.typography.fontFamily},
                    color: theme.palette.text.primary
                }
            },
            tooltip: {enabled: false},
            datalabels: {
                color: theme.palette.primary.contrastText,
                font: {
                    family: theme.typography.fontFamily,
                    size: 20,
                },
                formatter: (value, context) => value + "%"
            }
        }
    }), [theme]);
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

    const barChartData = useBarChartData();
    const barChartOptions = useBarChartOptions();
    const pieChartData = usePieChartData();
    const pieChartOptions = usePieChartOptions();

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
                        <Bar plugins={[ChartDataLabels]} data={barChartData} options={barChartOptions} height={300}/>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{p: 2, height: "100%", display: "flex", alignItems: "flex-end"}}>
                        <Pie plugins={[ChartDataLabels]} data={pieChartData} options={pieChartOptions}/>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
        <InfoDialog title={t('info')} content={<Lorem/>} {...infoProps} />
    </Track>
}

export default Feedback;