import CloudUploadOutlined from "@mui/icons-material/CloudUploadOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import History from "@mui/icons-material/History";
import Mood from "@mui/icons-material/Mood";
import ShowChart from "@mui/icons-material/ShowChart";
import {Container, Stack, Typography,} from "@mui/material";
import React, {useContext, useEffect} from 'react';
import {useTranslation} from "react-i18next";
import {PrivateRouteProps, UserContext} from "./App";
import {DestinationCard, DestinationCardProps} from "./common/DestinationCard";
import useDefaultTracking from "./common/Tracking";

const destinations: { [key: string]: DestinationCardProps } = {
    upload: {title: 'card_upload_title', subtitle: 'card_upload_subtitle', icon: CloudUploadOutlined, to: '/upload'},
    behavior: {title: 'card_behavior_title', subtitle: 'card_behavior_subtitle', icon: EditOutlined, to: '/behavior'},
    power: {title: 'card_power_title', subtitle: 'card_power_subtitle', icon: ShowChart, to: '/power'},
    archive: {title: 'card_archive_title', subtitle: 'card_archive_subtitle', icon: History, to: '/archive'},
    mood: {title: 'card_mood_title', subtitle: 'card_mood_subtitle', icon: Mood, to: '/mood'},
}

const userInteractionNeeded = (type: string) => {
    switch (type) {
        case "management":
            return [destinations.upload]
        case "student":
            return [destinations.archive, destinations.mood]
        case "homeowner":
            return [destinations.upload, destinations.mood]
        default:
            return null;
    }
}

const userResult = (type: string) => {
    switch (type) {
        case "homeowner":
            return [destinations.power]
        default:
            return null;
    }
}

function Home(props: PrivateRouteProps) {
    const {Track} = useDefaultTracking({page: 'Home'});
    const {t} = useTranslation();
    const {setAppBar} = props;
    const user = useContext(UserContext);
    const interactions = userInteractionNeeded(user.type);
    const results = userResult(user.type);

    useEffect(() => {
        setAppBar({
            title: t('home_title'),
            showBackButton: false,
            children: () => <></>
        })
    }, [t, setAppBar])

    return (
        <Track>
            <Container maxWidth="sm" sx={{paddingTop: 3}}>
                <Stack spacing={3}>
                    {interactions &&
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
                    {results &&
                    <Stack spacing={1}>
                        <Typography variant="h5">{t('home_item_results')}</Typography>
                        {results.map((item, index) =>
                            <DestinationCard
                                {...item}
                                title={t(item.title)}
                                subtitle={t(item.subtitle)}
                                done
                                key={index}
                            />
                        )}
                    </Stack>
                    }
                </Stack>
            </Container>
        </Track>
    );
}

export default Home;
