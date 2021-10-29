import CloudUploadOutlined from "@mui/icons-material/CloudUploadOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import History from "@mui/icons-material/History";
import Mood from "@mui/icons-material/Mood";
import ShowChart from "@mui/icons-material/ShowChart";
import {Box, Container, LinearProgress, Stack, Typography,} from "@mui/material";
import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {useTranslation} from "react-i18next";
import {PrivateRouteProps, UserContext} from "./App";
import {AlertSnackbar} from "./common/AlertSnackbar";
import {DestinationCard, DestinationCardProps} from "./common/DestinationCard";
import RetryMessage from "./common/RetryMessage";
import useDefaultTracking from "./common/Tracking";
import {useSnackBar} from "./common/UseSnackBar";
import {TaskModel} from "./service/Model";

const destinations: { [key: string]: DestinationCardProps } = {
    upload: {title: 'card_upload_title', subtitle: 'card_upload_subtitle', icon: CloudUploadOutlined, to: '/upload'},
    behavior: {title: 'card_behavior_title', subtitle: 'card_behavior_subtitle', icon: EditOutlined, to: '/behavior'},
    power: {title: 'card_power_title', subtitle: 'card_power_subtitle', icon: ShowChart, to: '/power'},
    archive: {title: 'card_archive_title', subtitle: 'card_archive_subtitle', icon: History, to: '/archive'},
    wellBeing: {title: 'card_well_being_title', subtitle: 'card_well_being_subtitle', icon: Mood, to: '/wellBeing'},
}

function Home(props: PrivateRouteProps) {
    const {Track} = useDefaultTracking({page: 'Home'});
    const {t} = useTranslation();
    const {setAppBar, backendService} = props;
    const user = useContext(UserContext);
    const [tasks, setTasks] = useState<TaskModel>()
    const [error, setError] = useSnackBar();
    const [progress, setProgress] = useState(true);
    const failed = !progress && !tasks;

    useEffect(() => {
        setAppBar({
            title: t('home_title'),
            showBackButton: false,
            children: () => <></>
        })
    }, [t, setAppBar])

    const initialLoad = useCallback(() => {
        setProgress(true);
        backendService.getTasks()
            .then(setTasks, setError)
            .catch(console.log)
            .finally(() => setProgress(false));
    }, [setError, backendService]);

    const interactions = useMemo(() => {
        const arr = new Array<DestinationCardProps>();
        tasks?.todoPrediction && arr.push(destinations.behavior);
        user?.type === 'homeowner' && tasks?.todoUpload && arr.push(destinations.upload);
        tasks?.todoVerifyPrediction && arr.push(destinations.archive);
        tasks?.todoWellBeing && arr.push(destinations.wellBeing);
        return arr;
    }, [tasks, user]);

    useEffect(initialLoad, [initialLoad]);
    console.log(tasks)

    return (
        <Track>
            {progress && <LinearProgress/>}
            {failed && <RetryMessage retry={initialLoad}/>}
            {tasks &&
            <Container maxWidth="sm" sx={{paddingTop: 3}}>
                {interactions.length <= 0 &&
                <Box pt={8}>
                    <Typography variant="h3" textAlign="center" paragraph children={t('home_well_done_title')}/>
                    <Typography variant="h5" textAlign="center" children={t('home_well_done_subtitle')}/>
                </Box>
                }
                {interactions.length > 0 &&
                <Stack spacing={1}>
                    <Typography variant="h5">{t('home_item_todos')}</Typography>

                    {interactions.map((item, index) =>
                        <DestinationCard
                            {...item}
                            title={t(item.title)}
                            subtitle={t(item.subtitle)}
                            key={index}
                        />
                    )}
                </Stack>
                }
                {tasks && !tasks.todoVerifyPrediction &&
                    <Box pt={10}>
                        <DestinationCard
                            {...destinations.archive}
                            title={t(destinations.archive.title)}
                            subtitle={t(destinations.archive.subtitle)}
                            done={true}
                        />
                    </Box>
                }
            </Container>
            }
            <AlertSnackbar {...error}/>
        </Track>
    );
}

export default Home;
