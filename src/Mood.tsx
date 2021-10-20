import {CheckCircleOutlined} from "@mui/icons-material";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import {TabContext, TabPanel} from "@mui/lab";
import {Box, Button, Container, DialogContentText, LinearProgress, Paper, Stack, Typography} from "@mui/material";
import 'chartjs-plugin-dragdata';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Bubble} from "react-chartjs-2";
import {useTranslation} from "react-i18next";
import {Link as RouterLink, Prompt} from "react-router-dom";
import {PrivateRouteProps, UserContext} from "./App";
import {AlertSnackbar} from "./common/AlertSnackbar";
import {InfoDialog, useInfoDialog} from "./common/InfoDialog";
import ResponsiveIconButton from "./common/ResponsiveIconButton";
import RetryMessage from "./common/RetryMessage";
import useDefaultTracking from "./common/Tracking";
import {useSnackBar} from "./common/UseSnackBar";
import {MoodModel} from "./service/Model";
import {useData, useOptions} from "./mood/Chart";

const date = new Date().toISOString().slice(0, 10)

function Mood(props: PrivateRouteProps) {
    const {Track} = useDefaultTracking({page: 'Mood'});
    const {t} = useTranslation()
    const [infoProps, openInfo] = useInfoDialog();
    const [success, setSuccess] = useSnackBar();
    const [error, setError] = useSnackBar();
    const [mood, setMood] = useState<MoodModel>();
    const [modified, setModified] = useState(false);
    const [panel, setPanel] = useState("0");
    const [progress, setProgress] = useState(true);
    const failed = !progress && !mood;

    const {backendService, setAppBar} = props;
    const user = useContext(UserContext);

    const initialLoad = useCallback(() => {
        setProgress(true);
        backendService.getMood(date)
            .then(setMood, setError)
            .then(() => setModified(false))
            .catch(console.log)
            .finally(() => setProgress(false));
    }, [backendService, setError]);

    useEffect(initialLoad, [initialLoad]);

    const onSaveClick = useCallback(() => {
        if (!mood) return;
        backendService.putMood(date, mood)
            .then(() => setSuccess(t('changes_saved')), setError)
            .then(() => setModified(false))
            .catch(console.log);
    }, [backendService, mood, setError, setSuccess, t]);

    const onMoodChange = useCallback((mood: MoodModel) => {
        setMood(mood);
        setModified(true);
    }, []);
    const data = useData(mood?.x ?? 0, mood?.y ?? 0);
    const options = useOptions(onMoodChange);

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

    const infoText = t('info_mood', {returnObjects: true}) as string[];
    const infoContent = <>{infoText.map(text => <DialogContentText paragraph children={text}/>)}</>

    const titleKey = user.type === "student" ? "mood_please_select_mood_student" : "mood_please_select_mood_homeowner";
    return <Track>
        {progress && <LinearProgress/>}
        {failed && <RetryMessage retry={initialLoad}/>}
        {mood &&
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
                        <Bubble data={data} options={options} height={100} width={100}/>
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
        }
        <Prompt when={modified} message={t('unsaved_changes')}/>
        <InfoDialog title={t('info')} content={infoContent} {...infoProps} />
        <AlertSnackbar {...success} severity="success"/>
        <AlertSnackbar {...error} />
    </Track>
}

export default Mood;