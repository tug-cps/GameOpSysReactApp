import InfoOutlined from "@mui/icons-material/InfoOutlined";
import SaveAlt from "@mui/icons-material/SaveAlt";
import {Box, Card, CardContent, Container, Typography, useTheme} from "@mui/material";
import 'chartjs-plugin-dragdata';
import React, {useCallback, useEffect, useState} from 'react';
import {Bubble, defaults} from "react-chartjs-2";
import {useTranslation} from "react-i18next";
import {PrivateRouteProps} from "./App";
import {AlertSnackbar} from "./common/AlertSnackbar";
import {Content, Root} from "./common/DefaultAppBar";
import {InfoDialog, Lorem, useInfoDialog} from "./common/InfoDialog";
import {ResponsiveIconButton} from "./common/ResponsiveIconButton";
import useDefaultTracking from "./common/Tracking";
import {useSnackBar} from "./common/UseSnackBar";
import {MoodModel} from "./service/Model";

interface GraphProps {
    mood: { x: number, y: number }
    onChange: (mood: { x: number, y: number }) => void
}

export const compareProps = (a: GraphProps, b: GraphProps) => a.mood.x === b.mood.x && a.mood.y === b.mood.y

const DraggableGraph = React.memo(function (props: GraphProps) {
    const theme = useTheme();
    const {t} = useTranslation();

    defaults.borderColor = theme.palette.divider;
    defaults.color = theme.palette.text.primary;
    const commonScaleProps = {
        alignToPixels: true,
        max: 10,
        min: 0,
        ticks: {display: false},
        grid: {display: false},
    }

    return <Bubble
        data={{
            labels: ["Red"],
            datasets: [{
                data: [{...props.mood, r: 20}],
                borderWidth: 1,
                backgroundColor: theme.palette.primary.main,
                pointHitRadius: 25
            }]
        }}
        options={{
            maintainAspectRatio: true,
            aspectRation: 1,
            scales: {
                y: {
                    ...commonScaleProps,
                    title: {
                        display: true,
                        text: [t('mood_very_uncomfortable') + ' ⟵      ⟶ ' + t('mood_very_comfortable')],
                    },
                },
                x: {
                    ...commonScaleProps,
                    title: {
                        display: true,
                        text: t('mood_very_cold') + ' ⟵      ⟶ ' + t('mood_very_hot'),
                    },
                }
            },
            onHover: function (e: any) {
                const point = e.chart.getElementsAtEventForMode(e, 'nearest', {intersect: true}, false)
                if (point.length) e.native.target.style.cursor = 'grab'
                else e.native.target.style.cursor = 'default'
            },
            plugins: {
                // @ts-ignore
                dragData: {
                    dragX: true,
                    showTooltip: true,
                    onDragStart: (e: any, element: any) => null,
                    onDrag: (e: any, datasetIndex: any, index: number, value: number) => null,
                    onDragEnd: (e: any, datasetIndex: any, index: number, value: { x: number, y: number, r: number }) => {
                        e.target.style.cursor = 'default'
                        props.onChange(value);
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
}, compareProps)

const date = new Date().toISOString().slice(0, 10)

function Mood(props: PrivateRouteProps) {
    const {Track} = useDefaultTracking({page: 'MoodPage'});
    const {t} = useTranslation()
    const [infoProps, openInfo] = useInfoDialog();
    const [success, setSuccess] = useSnackBar();
    const [error, setError] = useSnackBar();
    const [mood, setMood] = useState<MoodModel>({x: 5, y: 5});
    const [modified, setModified] = useState(false);

    const {backendService, setAppBar} = props;

    useEffect(() => {
        backendService.getMood(date)
            .then(setMood, setError)
            .then(() => setModified(false))
            .catch(console.log);
    }, [backendService, setError])

    const onSaveClick = useCallback(() => {
        backendService.putMood(date, mood!)
            .then(() => setSuccess(t('changes_saved')), setError)
            .then(() => setModified(false))
            .catch(console.log);
    }, [backendService, mood, setError, setSuccess, t])

    const onMoodChange = useCallback((mood: MoodModel) => {
        setMood(mood);
        setModified(true);
    }, [])

    useEffect(() => {
        setAppBar({
            title: t('card_mood_title'),
            showBackButton: true,
            children: () => <>
                <ResponsiveIconButton icon={<InfoOutlined/>} onClick={openInfo} description={t('info')}/>
                <ResponsiveIconButton requiresAttention={modified}
                                      icon={<SaveAlt/>}
                                      onClick={onSaveClick}
                                      description={t('save')}/>
            </>
        })
    }, [t, setAppBar, onSaveClick, openInfo, modified])

    return <Track>
        <Root>
            <Content>
                <Container maxWidth="sm">
                    <Box py={3}>
                        <Typography variant="h5" align="center">{t('mood_please_select_mood')}</Typography>
                        <Card>
                            {mood &&
                            <CardContent>
                                <DraggableGraph mood={mood} onChange={onMoodChange}/>
                            </CardContent>
                            }
                        </Card>
                    </Box>
                </Container>
            </Content>
        </Root>
        <InfoDialog title={t('info')} content={<Lorem/>} {...infoProps} />
        <AlertSnackbar {...success} severity="success"/>
        <AlertSnackbar {...error} />
    </Track>
}

export default Mood;