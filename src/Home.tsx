import React, {useEffect} from 'react';
import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Container,
    createStyles,
    Grid,
    SvgIcon,
    Theme,
    Typography,
    withStyles,
    WithStyles
} from "@material-ui/core";
import {Link as RouterLink} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useHomeDestinations} from "./common/Destinations";
import useDefaultTracking from "./common/Tracking";
import {PrivateRouteProps} from "./App";

const styles = ({palette}: Theme) => createStyles({
    media: {
        backgroundColor: palette.secondary.main,
        display: "flex",
        alignItems: "center",
        padding: "8px"
    },
    icon: {
        color: palette.background.paper
    }
});

interface Item {
    title: string
    subtitle: string
    icon: any
    to: string
}

interface CardProps {
    item: Item
}

const HomeCard = withStyles(styles)(
    function Component(props: CardProps & WithStyles<typeof styles>) {
        const {classes, item} = props
        const {t} = useTranslation()

        return (
            <Grid item xs={12} lg={4} key={item.title}>
                <Card>
                    <CardActionArea component={RouterLink} to={item.to}>
                        <Box display="flex">
                            <CardMedia className={classes.media}>
                                <SvgIcon component={item.icon} className={classes.icon}/>
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
)

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
                <Grid container justify="center">
                    {homeDestinations.map((item: Item, index: number) =>
                        <HomeCard item={item} key={index}/>)}
                </Grid>
            </Container>
        </Track>
    );
}

export default Home;
