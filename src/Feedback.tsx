import {ShowChartOutlined} from "@mui/icons-material";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import {Container, DialogContentText, Grid, LinearProgress, Paper, useTheme} from "@mui/material";
import {blue, green, red, yellow} from "@mui/material/colors";
import {ChartData, ChartOptions, Plugin as ChartPlugin} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {isPast, isValid} from "date-fns";
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Bar, Pie} from "react-chartjs-2";
import {useTranslation} from "react-i18next";
import {Redirect, useLocation} from "react-router-dom";
import {PrivateRouteProps} from "./App";
import {AlertSnackbar} from "./common/AlertSnackbar";
import {useParsedDate} from "./common/Date";
import {InfoDialog, useInfoDialog} from "./common/InfoDialog";
import ResponsiveIconButton from "./common/ResponsiveIconButton";
import RetryMessage from "./common/RetryMessage";
import useDefaultTracking from "./common/Tracking";
import {useSnackBar} from "./common/UseSnackBar";
import {FeedbackModel} from "./service/Model";

const useBarChartData: (data: { self: number, others: number }) => ChartData<"bar"> = (data) => {
    const theme = useTheme();
    const {t} = useTranslation();
    return useMemo(() => ({
        labels: [t('feedback_energy_consumption')],
        datasets: [
            {
                label: t('feedback_my_energy_consumption'),
                data: [data.self],
                backgroundColor: red["800"],
                borderColor: theme.palette.background.paper,
            },
            {
                label: t('feedback_other_energy_consumption'),
                data: [data.others],
                backgroundColor: blue["800"],
                borderColor: theme.palette.background.paper,
            },
        ],
    }), [theme, data.self, data.others, t]);
};
const usePieChartData: (data: { high: number, med: number, low: number }) => ChartData<"pie"> = (data) => {
    const theme = useTheme();
    const {t} = useTranslation();
    return useMemo(() => ({
        labels: [t('feedback_high_energy'), t('feedback_med_energy'), t('feedback_low_energy')],
        datasets: [
            {
                data: [data.high, data.med, data.low].map(v => v * 100),
                backgroundColor: [green["800"], yellow["800"], red["800"]],
                borderColor: theme.palette.background.paper,
            },
        ],
    }), [theme, data.high, data.med, data.low, t]);
}
const useBarChartOptions: () => ChartOptions<"bar"> = () => {
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
                formatter: value => value.toFixed(1) + " kWh"
            }
        }
    }), [theme]);
}
const usePieChartOptions: () => ChartOptions<"pie"> = () => {
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
                formatter: value => value.toFixed(1) + "%"
            }
        }
    }), [theme]);
}

function Feedback(props: PrivateRouteProps) {
    const {Track} = useDefaultTracking({page: 'Feedback'});
    const {t} = useTranslation()
    const [infoProps, openInfo] = useInfoDialog();
    const [openBehavior, setOpenBehavior] = useState(false);
    const query = new URLSearchParams(useLocation().search);
    const date = query.get("date")!;
    const dateParsed = useParsedDate(date);
    const validDate = isValid(dateParsed) && isPast(dateParsed);
    const {setAppBar, backendService} = props;

    const [feedback, setFeedback] = useState<FeedbackModel>()
    const [progress, setProgress] = useState(true);
    const [error, setError] = useSnackBar();

    const barChartData = useBarChartData(feedback?.totalUsage ?? {self: 0, others: 0});
    const barChartOptions = useBarChartOptions();
    const pieChartData = usePieChartData(feedback?.relativeUsage ?? {high: 0, med: 0, low: 0});
    const pieChartOptions = usePieChartOptions();
    const failed = !progress && !feedback;

    const initialLoad = useCallback(() => {
        if (!validDate) return;
        backendService.getFeedback(date)
            .then(setFeedback, setError)
            .catch(console.log)
            .finally(() => setProgress(false));
    }, [backendService, validDate, date, setError]);

    useEffect(initialLoad, [initialLoad])

    useEffect(() => {
        setAppBar({
            title: t('card_behavior_full_title', {date: dateParsed}),
            children: () => <>
                <ResponsiveIconButton icon={<InfoOutlined/>} onClick={openInfo} description={t('info')}/>
                <ResponsiveIconButton description={t('card_behavior_title')}
                                      icon={<ShowChartOutlined/>}
                                      onClick={() => setOpenBehavior(true)}/>
            </>
        })
    }, [dateParsed, t, setAppBar, openInfo])

    if (!validDate) return <Redirect to={'/'}/>
    if (openBehavior) return <Redirect to={'/pastbehavior?date=' + date}/>

    const InfoContent = () => {
        const infoText = t('info_feedback', {returnObjects: true}) as string[]
        return <>{infoText.map(text => <DialogContentText paragraph children={text}/>)}</>
    }

    return <Track>
        {progress && <LinearProgress/>}
        {failed && <RetryMessage retry={initialLoad}/>}
        {feedback &&
        <Container maxWidth="lg" sx={{paddingTop: 1}}>
            <Grid container spacing={1}>
                <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{p: 2, height: "100%", display: "flex", alignItems: "flex-end"}}>
                        <Bar plugins={[ChartDataLabels as ChartPlugin<"bar">]}
                             data={barChartData}
                             options={barChartOptions} height={300}/>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{p: 2, height: "100%", display: "flex", alignItems: "flex-end"}}>
                        <Pie plugins={[ChartDataLabels as ChartPlugin<"pie">]}
                             data={pieChartData}
                             options={pieChartOptions}/>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
        }
        <AlertSnackbar {...error}/>
        <InfoDialog title={t('info')} content={<InfoContent/>} {...infoProps} />
    </Track>
}

export default Feedback;