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
import {WithTranslation, withTranslation} from "react-i18next";
import DefaultAppBar from "./common/DefaultAppBar";
import ShowChartIcon from '@material-ui/icons/ShowChart';
import HistoryIcon from '@material-ui/icons/History';

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
    title: string;
    subtitle: string;
    icon: any;
    destination: string;
    header: boolean
}

interface CardProps {
    item: Item
}

const HomeCard = withStyles(styles)(
    class extends React.Component<CardProps & WithStyles<typeof styles>, {}> {
        render() {
            const {classes, item} = this.props

            return (
                <Grid item xs={12} sm={item.header ? 12 : 6} xl={item.header ? 12 : 4} key={item.title}>
                    <Card>
                        <CardActionArea component={RouterLink} to={item.destination}>
                            <Box display="flex">
                                <CardMedia className={classes.media}>
                                    <SvgIcon component={item.icon} className={classes.icon}/>
                                </CardMedia>
                                <CardContent>
                                    <Typography variant="h6">{item.title}</Typography>
                                    <Typography color="textSecondary" noWrap>{item.subtitle}</Typography>
                                </CardContent>
                            </Box>
                        </CardActionArea>
                    </Card>
                </Grid>
            )
        }
    }
)

class Home extends React.Component<WithTranslation> {

    render() {
        const {t} = this.props;

        const items: Item[] = [
            {
                title: t('card_power_title'),
                subtitle: t('card_power_subtitle'),
                icon: ShowChartIcon,
                destination: '/power',
                header: false
            },
            {
                title: t('card_archive_title'),
                subtitle: t('card_archive_subtitle'),
                icon: HistoryIcon,
                destination: '/archive',
                header: false
            },
        ]

        return (
            <React.Fragment>
                <DefaultAppBar hideBackButton title={t('home_title')}/>
                <Container maxWidth="lg" disableGutters>
                    <Box padding={1}>
                        <Grid container>
                            {items.map((item: Item, index: number) => <HomeCard item={item} key={index}/>)}
                        </Grid>
                    </Box>
                </Container>
            </React.Fragment>
        );
    }
}

export default withTranslation()(Home);
