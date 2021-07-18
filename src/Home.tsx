import React from 'react';
import {
    AppBar,
    Button,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Container,
    createStyles,
    Grid,
    Theme,
    Toolbar,
    Typography,
    withStyles,
    WithStyles
} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import {Link as RouterLink} from "react-router-dom";
import {WithTranslation, withTranslation} from "react-i18next";

const styles = (theme: Theme) => createStyles({
    card: {
        borderColor: theme.palette.secondary.main,
    },
    root: {
        flexGrow: 1,
    },
    media: {
        minHeight: 120,
        backgroundColor: theme.palette.secondary.main,
    },
    largeIcon: {
        fontSize: "8em",
    },
    title: {
        flexGrow: 1,
    },
});

interface Item {
    title: string;
    subtitle: string;
    icon: string;
    destination: string;
    header: boolean
}

interface Props {
}

interface State {
}

class Home extends React.Component<Props & WithStyles<typeof styles> & WithTranslation, State> {
    render() {
        const {classes, t} = this.props;

        const items = [
            {
                title: t('card_upload_title'),
                subtitle: t('card_upload_subtitle'),
                icon: 'cloud_upload',
                destination: '/upload',
                header: false
            },
            {
                title: t('card_behavior_title'),
                subtitle: t('card_behavior_subtitle'),
                icon: 'edit',
                destination: '/behavior',
                header: false
            },
            {
                title: t('card_power_title'),
                subtitle: t('card_power_subtitle'),
                icon: 'show_chart',
                destination: '/power',
                header: false
            },
            {
                title: t('card_archive_title'),
                subtitle: t('card_archive_subtitle'),
                icon: 'history',
                destination: '/archive',
                header: false
            },
            {
                title: t('card_user_title'),
                subtitle: t('card_user_subtitle'),
                icon: 'person',
                destination: '/user',
                header: false
            },
            {
                title: t('card_thermostats_title'),
                subtitle: t('card_thermostats_subtitle'),
                icon: 'power',
                destination: '/thermostats',
                header: false
            }
        ]

        function createCard(item: Item) {
            return (
                <Grid item xs={item.header ? 12 : 6} xl={item.header ? 12 : 4} key={item.title}>
                    <Card variant="outlined" className={classes.card}>
                        <CardActionArea component={RouterLink} to={item.destination}>
                            <CardMedia className={classes.media}>
                                <Typography align='center'>
                                    <Icon className={classes.largeIcon} style={{color: '#fff'}}>{item.icon}</Icon>
                                </Typography>
                            </CardMedia>
                            <CardContent>
                                <Typography variant="h6">{item.title}</Typography>
                                <Typography color="textSecondary" noWrap>{item.subtitle}</Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            )
        }

        return (
            <React.Fragment>
                <AppBar position="sticky">
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>GameOpSysApp</Typography>
                        <Button color="inherit" component={RouterLink} to="/logout">{t('logout')}</Button>
                    </Toolbar>
                </AppBar>
                <Container component="main" maxWidth="lg" disableGutters className={classes.root}>
                    <Grid container spacing={1}>{items.map(createCard)}</Grid>
                </Container>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(withTranslation()(Home));
