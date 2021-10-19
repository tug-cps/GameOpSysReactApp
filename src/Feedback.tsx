import InfoOutlined from "@mui/icons-material/InfoOutlined";
import {Container, Paper} from "@mui/material";
import {blue, red} from "@mui/material/colors";
import {ChartData, ChartOptions} from "chart.js";
import 'chartjs-plugin-dragdata';
import {isPast, isValid} from "date-fns";
import React, {useEffect} from 'react';
import {Bar} from "react-chartjs-2";
import {useTranslation} from "react-i18next";
import {Redirect, useLocation} from "react-router-dom";
import {PrivateRouteProps} from "./App";
import {useParsedDate} from "./common/Date";
import {InfoDialog, Lorem, useInfoDialog} from "./common/InfoDialog";
import ResponsiveIconButton from "./common/ResponsiveIconButton";
import useDefaultTracking from "./common/Tracking";

const data: ChartData = {
    labels: ['Ihr Stromverbrauch', 'Durchschnittlicher Stromverbrauch der anderen'],
    datasets: [
        {
            data: [15, 10],
            backgroundColor: [red["600"], blue["600"]],
            barPercentage: 0.9,
            categoryPercentage: 0.9
        },
    ],
};

const options: ChartOptions = {
    scales: {
        xAxis: {
            ticks: {}
        },
        yAxis: {
            display: false,
        }
    },
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            enabled: false
        },
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
        <Container maxWidth="sm" sx={{paddingTop: 1}}>
            <Paper variant="outlined" sx={{p: 2}}>
                <Bar data={data} options={options}/>
            </Paper>
        </Container>
        <InfoDialog title={t('info')} content={<Lorem/>} {...infoProps} />
    </Track>
}

export default Feedback;