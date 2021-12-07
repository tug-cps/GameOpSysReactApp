import {ShowChartOutlined} from "@mui/icons-material";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import {Container, DialogContentText, Grid, LinearProgress, Paper} from "@mui/material";

import 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {isPast, isValid} from "date-fns";
import React, {useCallback, useEffect, useState} from 'react';
import {Chart} from "react-chartjs-2";
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
import {useBarChartData, useBarChartOptions, usePieChartData, usePieChartOptions} from "./feedback/Charts";
import {FeedbackModel} from "./service/Model";

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
                        <Chart
                            type='bar'
                            plugins={[ChartDataLabels]}
                            data={barChartData}
                            options={barChartOptions}
                            height={300}/>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{p: 2, height: "100%", display: "flex", alignItems: "flex-end"}}>
                        <Chart
                            type='pie'
                            plugins={[ChartDataLabels]}
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