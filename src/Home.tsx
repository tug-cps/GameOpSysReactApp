import {Box, Card, CardActionArea, CardContent, CardMedia, Container, Grid, SvgIcon, Typography,} from "@mui/material";
import React, {useEffect} from 'react';
import {useTranslation} from "react-i18next";
import {Link as RouterLink} from "react-router-dom";
import {PrivateRouteProps} from "./App";
import {useHomeDestinations} from "./common/Destinations";
import useDefaultTracking from "./common/Tracking";

interface Item {
    title: string
    subtitle: string
    icon: any
    to: string
}

interface CardProps {
    item: Item
}

function HomeCard(props: CardProps) {
    const {item} = props
    const {t} = useTranslation()

    return (
        <Grid item xs={12} lg={4} key={item.title}>
            <Card>
                <CardActionArea component={RouterLink} to={item.to}>
                    <Box display="flex">
                        <CardMedia sx={{
                            backgroundColor: 'secondary.main',
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
        </Grid>
    )
}

function Home(props: PrivateRouteProps) {
    const {Track} = useDefaultTracking({page: 'Home'});
    const homeDestinations = useHomeDestinations();
    const {t} = useTranslation();
    const {setAppBar} = props;

    useEffect(() => {
        setAppBar({
            title: t('home_title'),
            showBackButton: false,
            children: () => <></>
        })
    }, [t, setAppBar])

    return (
        <Track>
            <Container maxWidth="lg">
                <Grid container justifyContent="center">
                    {homeDestinations.map((item: Item, index: number) =>
                        <HomeCard item={item} key={index}/>)}
                </Grid>
            </Container>
        </Track>
    );
}

export default Home;
