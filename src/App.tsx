import React from 'react';
import {
    AppBar,
    Button,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Container,
    CssBaseline,
    Grid,
    Theme,
    Toolbar,
    Typography
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import {Link as RouterLink} from "react-router-dom";

const useStyles = makeStyles((theme: Theme) => ({
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
}));

interface Item {
    title: string;
    subtitle: string;
    icon: string;
    destination: string;
    header: boolean
}

function App() {
    const classes = useStyles();
    const items: Item[] = [
        {
            title: 'Upload',
            subtitle: 'Upload energy consumption',
            icon: 'cloud_upload',
            destination: '/upload',
            header: false
        },
        {
            title: 'Behavior',
            subtitle: 'My daily prediction',
            icon: 'edit',
            destination: '/behavior',
            header: false
        },
        {
            title: 'Power',
            subtitle: 'My accuracy',
            icon: 'show_chart',
            destination: '/power',
            header: false
        },
        {
            title: 'Archive',
            subtitle: 'My previous predictions',
            icon: 'history',
            destination: '/archive',
            header: false
        },
        {
            title: 'Surveys',
            subtitle: 'My surveys',
            icon: 'assignment',
            destination: '/survey',
            header: false
        },
        {
            title: 'My Data',
            subtitle: 'Edit my data',
            icon: 'person',
            destination: '/user',
            header: false
        },
    ];

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
                    <Button color="inherit" component={RouterLink} to="/logout">Logout</Button>
                </Toolbar>
            </AppBar>
            <Container component="main" maxWidth="lg" disableGutters className={classes.root}>
                <CssBaseline/>
                <Grid container spacing={1}>{items.map(createCard)}</Grid>
            </Container>
        </React.Fragment>

    );
}

export default App;
