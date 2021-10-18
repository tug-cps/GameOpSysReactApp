import InfoOutlined from "@mui/icons-material/InfoOutlined";
import {
    Box,
    Button,
    Container,
    DialogContentText,
    LinearProgress,
    Paper,
    Stack,
    Typography,
    useTheme
} from "@mui/material";
import 'chartjs-plugin-dragdata';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Bubble, defaults} from "react-chartjs-2";
import {useTranslation} from "react-i18next";
import {PrivateRouteProps, UserContext} from "./App";
import {AlertSnackbar} from "./common/AlertSnackbar";
import {InfoDialog, useInfoDialog} from "./common/InfoDialog";
import {ResponsiveIconButton} from "./common/ResponsiveIconButton";
import useDefaultTracking from "./common/Tracking";
import {useSnackBar} from "./common/UseSnackBar";
import {MoodModel} from "./service/Model";
import {Link as RouterLink, Prompt} from "react-router-dom";
import {CheckCircleOutlined} from "@mui/icons-material";
import {TabContext, TabPanel} from "@mui/lab";

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
                    onDragStart: () => null,
                    onDrag: () => null,
                    onDragEnd: (e: any, datasetIndex: any, index: number, value: { x: number, y: number, r: number }) => {
                        e.target.style.cursor = 'default'
                        props.onChange(value);
                    },
                },
                legend: {display: false},
                tooltip: {enabled: false}
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
    const [mood, setMood] = useState<MoodModel>();
    const [modified, setModified] = useState(false);
    const [panel, setPanel] = useState("0");

    const {backendService, setAppBar} = props;
    const user = useContext(UserContext);

    useEffect(() => {
        backendService.getMood(date)
            .then(setMood, setError)
            .then(() => setModified(false))
            .catch(console.log);
    }, [backendService, setError])

    const onSaveClick = useCallback(() => {
        if (!mood) return;
        backendService.putMood(date, mood)
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
            children: () => {
                if (panel !== "1") return <></>
                return <>
                    <ResponsiveIconButton icon={<InfoOutlined/>} onClick={openInfo} description={t('info')}/>
                    <ResponsiveIconButton requiresAttention={modified}
                                          icon={<CheckCircleOutlined/>}
                                          onClick={onSaveClick}
                                          description={t('save')}/>
                </>
            }
        })
    }, [t, setAppBar, onSaveClick, openInfo, modified, panel])

    if (!mood) return <LinearProgress/>;

    const infoText = t('info_mood', {returnObjects: true}) as string[];
    const infoContent = <>{infoText.map(text => <DialogContentText paragraph children={text}/>)}</>

    const titleKey = user?.type === "student" ? "mood_please_select_mood_student" : "mood_please_select_mood_homeowner";
    return <Track>
        <Container maxWidth="sm" sx={{paddingTop: 3}} disableGutters>
            <TabContext value={panel}>
                <TabPanel value="0">
                    <Paper variant="outlined" sx={{p: 2}}>
                        <Typography variant="h5">{t('mood_question_home')}</Typography>
                        <Box mt={5}/>
                        <Stack direction="row" sx={{justifyContent: "flex-end", pt: 2}}>
                            <Button
                                variant="contained"
                                onClick={() => setPanel('1')}
                                children={t('yes')}/>
                            <Button
                                sx={{marginLeft: 2}}
                                variant="contained"
                                onClick={() => setPanel('2')}
                                children={t('no')}/>
                        </Stack>
                    </Paper>
                </TabPanel>
                <TabPanel value="1">
                    <Typography variant="h5" align="center" paragraph>{t(titleKey)}</Typography>
                    <Paper variant="outlined" sx={{p: 2}}>
                        <DraggableGraph mood={mood} onChange={onMoodChange}/>
                    </Paper>
                </TabPanel>
                <TabPanel value="2">
                    <Paper square variant="outlined" sx={{p: 2}}>
                        <Typography variant="h5">{t('mood_come_back_later')}</Typography>
                        <Box mt={5}/>
                        <Stack direction="row" sx={{justifyContent: "flex-end", pt: 2}}>
                            <Button variant="contained" component={RouterLink} to="/">{t('go_back')}</Button>
                        </Stack>
                    </Paper>
                </TabPanel>
            </TabContext>
        </Container>
        <Prompt when={modified} message={t('unsaved_changes')}/>
        <InfoDialog title={t('info')} content={infoContent} {...infoProps} />
        <AlertSnackbar {...success} severity="success"/>
        <AlertSnackbar {...error} />
    </Track>
}

export default Mood;