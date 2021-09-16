import React from 'react';
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
import DefaultAppBar, {Content, Root} from "./common/DefaultAppBar";
import {useHomeDestinations} from "./common/Destinations";
import useDefaultTracking from "./common/Tracking";

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
            <Grid item xs={12} sm={6} xl={4} key={item.title}>
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

function Home() {
    const {Track} = useDefaultTracking({page: 'Home'});
    const homeDestinations = useHomeDestinations();
    const {t} = useTranslation();
    return (
        <Track>
            <Root>
                <DefaultAppBar hideBackButton title={t('home_title')}/>
                <Content>
                    <Container maxWidth="lg" disableGutters>
                        <Grid container>
                            {homeDestinations.map((item: Item, index: number) =>
                                <HomeCard item={item} key={index}/>)}
                        </Grid>
                    </Container>
                </Content>
            </Root>

        </Track>
    );
}

export default Home;
