import {BarChartOutlined, CheckCircleOutlined, InfoOutlined, RadioButtonUncheckedOutlined} from "@mui/icons-material";
import {Container, DialogContentText, LinearProgress, Stack} from "@mui/material";
import {parse} from "date-fns";
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {PrivateRouteProps} from "./App";
import {AlertSnackbar} from "./common/AlertSnackbar";
import {DestinationCard} from "./common/DestinationCard";
import {InfoDialog, useInfoDialog} from "./common/InfoDialog";
import ResponsiveIconButton from "./common/ResponsiveIconButton";
import RetryMessage from "./common/RetryMessage";
import useDefaultTracking from "./common/Tracking";
import {useSnackBar} from "./common/UseSnackBar";
import {PredictionDateEntry} from "./service/Model";

function Archive(props: PrivateRouteProps) {
    const {Track} = useDefaultTracking({page: 'Archive'});
    const [infoProps, openInfo] = useInfoDialog();
    const [entries, setEntries] = useState<PredictionDateEntry[]>();
    const [progress, setProgress] = useState(true);
    const {t} = useTranslation();
    const [error, setError] = useSnackBar();
    const {backendService, setAppBar} = props;
    const failed = !progress && !entries;

    const initialLoad = useCallback(() => {
        setProgress(true);
        backendService.getPredictions()
            .then(setEntries, setError)
            .catch(console.log)
            .finally(() => setProgress(false))
    }, [backendService, setError])

    useEffect(initialLoad, [initialLoad])

    useEffect(() => {
        setAppBar({
            title: t('card_archive_title'),
            showBackButton: true,
            children: () => <ResponsiveIconButton
                description={t('info')}
                icon={<InfoOutlined/>}
                onClick={openInfo}
            />
        });
    }, [t, setAppBar, openInfo])

    return (
        <Track>
            {progress && <LinearProgress/>}
            {failed && <RetryMessage retry={initialLoad}/>}
            {entries &&
            <Container maxWidth="sm" sx={{pt: 1}}>
                <Stack spacing={1}>
                    {entries.map(entry => {
                            const parsedDate = parse(entry.date, 'yyyy-MM-dd', new Date())
                            const done = entry.validated;
                            return <DestinationCard
                                to={`/pastbehavior?date=${entry.date}`}
                                icon={done ? CheckCircleOutlined : RadioButtonUncheckedOutlined}
                                title={t('archive_entry_date', {date: parsedDate})}
                                subtitle={t(done ? t('archive_already_done') : t('archive_please_check'))}
                                done={done}
                                secondaryTo={(done && `/feedback?date=${entry.date}`) || undefined}
                                secondaryIcon={(done && BarChartOutlined) || undefined}
                            />
                        }
                    )}
                </Stack>
            </Container>
            }
            <InfoDialog title={t('info')} content={<DialogContentText children={t('info_archive')}/>} {...infoProps}/>
            <AlertSnackbar {...error} />
        </Track>
    )
}

export default Archive;
