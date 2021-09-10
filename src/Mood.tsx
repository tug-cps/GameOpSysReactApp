import React, {useEffect, useState} from 'react';
import DefaultAppBar from "./common/DefaultAppBar";
import {Box, Card, CardContent, Container, IconButton, Tooltip, Typography, useTheme} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import {SaveAlt} from "@material-ui/icons";
import {Bubble} from "react-chartjs-2";
import 'chartjs-plugin-dragdata';
import {useSnackBar} from "./common/UseSnackBar";
import {AlertSnackbar} from "./common/AlertSnackbar";
import {defaults} from 'react-chartjs-2';
import BackendService from "./service/BackendService";


function DraggableGraph(props: { mood: { x: number, y: number }, onChange: (mood: { x: number, y: number }) => void }) {
    const theme = useTheme();

    defaults.borderColor = theme.palette.divider;
    defaults.color = theme.palette.text.primary;

    return <Bubble
        data={{
            labels: ["Red"],
            datasets: [{
                data: [{...props.mood, r: 20}],
                borderWidth: 1,
                hoverRadius: 0,
                backgroundColor: theme.palette.primary.main,
                pointHitRadius: 25
            }]
        }}
        options={{
            maintainAspectRatio: true,
            aspectRation: 1,
            scales: {
                y: {
                    alignToPixels: true,
                    max: 10,
                    min: 0,
                    ticks: {
                        // callback: (value: any, index: number, ticks: any) => {
                        //     return value == 10 || value == 0 ? value : null;
                        // }
                    },
                    grid: {
                        display: true,
                    },
                    title: {
                        display: true,
                        text: ['sehr unangenehm ←   --------------------------   → sehr angenehm'],
                    },
                },
                x: {
                    alignToPixels: true,
                    max: 10,
                    min: 0,
                    ticks: {},
                    grid: {
                        display: true,
                    },
                    title: {
                        display: true,
                        text: 'sehr kalt ←   --------------------------   → sehr heiß',
                    },
                }
            },
            onHover: function (e: any) {
                const point = e.chart.getElementsAtEventForMode(e, 'nearest', {intersect: true}, false)
                if (point.length) e.native.target.style.cursor = 'grab'
                else e.native.target.style.cursor = 'default'
            },
            animation: false,
            plugins: {
                dragData: {
                    dragX: true,
                    showTooltip: true,
                    onDragStart: (e: any, element: any) => null,
                    onDrag: (e: any, datasetIndex: any, index: number, value: number) => null,
                    onDragEnd: (e: any, datasetIndex: any, index: number, value: { x: number, y: number, r: number }) => {
                        e.target.style.cursor = 'default'
                        props.onChange(value);
                    },
                    magnet: {
                        to: (value: { x: number, y: number, r: number }) => ({
                            x: Math.round(value.x),
                            y: Math.round(value.y),
                            r: value.r
                        })
                    },
                },
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            }
        }} height={100} width={100}/>
}

const date = new Date().toISOString().slice(0, 10)

function Mood(props: { backendService: BackendService }) {
    const {t} = useTranslation()
    const [success, setSuccess] = useSnackBar();
    const [error, setError] = useSnackBar();
    const [mood, setMood] = useState({x: 5, y: 5});

    const {backendService} = props;

    useEffect(() => {
        backendService.getMood(date)
            .then(setMood, setError)
            .catch(console.log);
    }, [backendService, setError])

    const onSaveClick = () => {
        backendService.putMood(date, mood)
            .then(() => setSuccess(t('behavior_changes_saved')), setError)
            .catch(console.log);
    }

    return <React.Fragment>
        <DefaultAppBar title={t('card_mood_title')}>
            <Tooltip title={t('save') as string}>
                <IconButton color="inherit"
                            onClick={onSaveClick}><SaveAlt/></IconButton>
            </Tooltip>
        </DefaultAppBar>
        <Container maxWidth="sm">
            <Box py={3}>
                <Typography variant="h5" align="center">Bitte wählen Sie Ihr aktuelles Wohlbefinden aus</Typography>
                <Card>
                    <CardContent>
                        <DraggableGraph mood={mood} onChange={setMood}/>
                    </CardContent>
                </Card>
            </Box>
        </Container>
        <AlertSnackbar {...success} severity="success"/>
        <AlertSnackbar {...error} />
    </React.Fragment>
}

export default Mood;