import {CheckCircleOutlined, InfoOutlined, RadioButtonUncheckedOutlined} from "@mui/icons-material";
import {Container, DialogContentText, LinearProgress, Stack} from "@mui/material";
import {parse} from "date-fns";
import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {PrivateRouteProps} from "./App";
import {AlertSnackbar} from "./common/AlertSnackbar";
import {DestinationCard} from "./common/DestinationCard";
import {InfoDialog, useInfoDialog} from "./common/InfoDialog";
import {ResponsiveIconButton} from "./common/ResponsiveIconButton";
import useDefaultTracking from "./common/Tracking";
import {useSnackBar} from "./common/UseSnackBar";

function Archive(props: PrivateRouteProps) {
    const {Track} = useDefaultTracking({page: 'Archive'});
    const [infoProps, openInfo] = useInfoDialog();
    const [dates, setDates] = useState<string[]>();
    const {t} = useTranslation();
    const [error, setError] = useSnackBar();
    const {backendService, setAppBar} = props;

    useEffect(() => {
        backendService.getPredictions()
            .then(setDates, setError)
            .catch(console.log)
    }, [backendService, setError])

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

    if (!dates) return <LinearProgress/>

    return (
        <Track>
            <Container maxWidth="sm" sx={{pt: 1}}>
                <Stack spacing={1}>
                    {dates.map((date, index) => {
                            const parsedDate = parse(date, 'yyyy-MM-dd', new Date())
                            return <DestinationCard
                                to={`/pastbehavior?date=${date}`}
                                icon={index ? CheckCircleOutlined : RadioButtonUncheckedOutlined}
                                title={t('archive_entry_date', {date: parsedDate})}
                                subtitle={index ? 'Bereits erledigt' : 'Bitte überpüfen'}
                                done={!!index}
                            />
                        }
                    )}
                </Stack>
            </Container>
            <InfoDialog title={t('info')} content={<DialogContentText children={t('info_archive')}/>} {...infoProps}/>
            <AlertSnackbar {...error} />
        </Track>
    )
}

export default Archive;
