import CloudUploadOutlined from "@mui/icons-material/CloudUploadOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import History from "@mui/icons-material/History";
import Mood from "@mui/icons-material/Mood";
import ShowChart from "@mui/icons-material/ShowChart";
import {Box, Card, CardActionArea, CardContent, CardMedia, Container, Stack, SvgIcon, Typography,} from "@mui/material";
import React, {useContext, useEffect} from 'react';
import {useTranslation} from "react-i18next";
import {Link as RouterLink} from "react-router-dom";
import {PrivateRouteProps, UserContext} from "./App";
import useDefaultTracking from "./common/Tracking";

interface Item {
    title: string
    subtitle: string
    icon: any
    to: string
}

interface CardProps {
    item: Item,
    done: boolean
}

function HomeCard(props: CardProps) {
    const {item, done} = props
    const {t} = useTranslation()

    return (
        <Card sx={{borderColor: done ? undefined : "warning.main"}}>
            <CardActionArea component={RouterLink} to={item.to}>
                <Box display="flex">
                    <CardMedia sx={{
                        backgroundColor: done ? "secondary.main" : "warning.main",
                        display: "flex",
                        alignItems: "center",
                        padding: "8px"
                    }}>
                        <SvgIcon component={item.icon} sx={{color: 'background.paper'}}/>
                    </CardMedia>
                    <CardContent>
                        <Typography variant="h6">{t(item.title)}</Typography>
                        <Typography color="textSecondary" noWrap>{t(item.subtitle)}</Typography>
                    </CardContent>
                </Box>
            </CardActionArea>
        </Card>
    )
}

const destinations = {
    upload: {title: 'card_upload_title', subtitle: 'card_upload_subtitle', icon: CloudUploadOutlined, to: '/upload'},
    behavior: {title: 'card_behavior_title', subtitle: 'card_behavior_subtitle', icon: EditOutlined, to: '/behavior'},
    power: {title: 'card_power_title', subtitle: 'card_power_subtitle', icon: ShowChart, to: '/power'},
    archive: {title: 'card_archive_title', subtitle: 'card_archive_subtitle', icon: History, to: '/archive'},
    mood: {title: 'card_mood_title', subtitle: 'card_mood_subtitle', icon: Mood, to: '/mood'},
}

const userInteractionNeeded = (type?: string) => {
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

const userResult = (type?: string) => {
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
    const interactions = userInteractionNeeded(user?.type);
    const results = userResult(user?.type);

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
                        <Typography textAlign="center" variant="h5">Ihre Aufmerksamkeit wird benötigt</Typography>
                        {interactions.map((item: Item, index: number) =>
                            <HomeCard item={item} done={false} key={index}/>)}
                    </Stack>
                    }
                    {results &&
                    <Stack spacing={1}>
                        <Typography textAlign="center" variant="h5">Neue Ergebnisse verfügbar</Typography>
                        {results.map((item: Item, index: number) =>
                            <HomeCard item={item} done key={index}/>)}
                    </Stack>
                    }
                </Stack>
            </Container>
        </Track>
    );
}

export default Home;
