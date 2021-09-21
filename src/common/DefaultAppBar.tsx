import {
    AppBar,
    Box,
    Divider,
    Drawer,
    Hidden,
    IconButton,
    LinearProgress,
    ListItemIcon,
    Slide,
    SvgIcon,
    Toolbar,
    Typography,
    useScrollTrigger
} from "@material-ui/core";
import {Link as RouterLink, useHistory} from "react-router-dom";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {useTranslation} from "react-i18next";
import {useNavDrawerDestinations} from "./Destinations";
import {ArrowBack} from "@material-ui/icons";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
        menuButton: {
            marginRight: theme.spacing(2),
        },
        menu: {
            width: drawerWidth,
        },
        toolbar: theme.mixins.toolbar,
        root: {
            display: "flex",
        },
        content: {
            flexGrow: 1
        },
        drawer: {
            [theme.breakpoints.up('sm')]: {
                flexShrink: 0,
                width: drawerWidth,
            }
        },
        appBar: {
            [theme.breakpoints.up('sm')]: {
                marginLeft: drawerWidth,
                width: `calc(100% - ${drawerWidth}px)`,
            }
        }
    })
);

export interface Props {
    hideBackButton?: boolean;
    title: string;
    multiLine?: React.ReactNode;
}

export function DefaultDrawer() {
    const classes = useStyles();
    const {t} = useTranslation();
    const destinations = useNavDrawerDestinations();

    return (
        <nav className={classes.drawer}>
            <Hidden xsDown>
                <Drawer open variant="persistent">
                    <Box role="presentation" className={classes.menu}>
                        <AppBarSpace/>
                        <Divider/>
                        <List>
                            {destinations.map((d) =>
                                <ListItem button key={d.title} component={RouterLink} to={d.to}>
                                    <ListItemIcon><SvgIcon component={d.icon}/></ListItemIcon>
                                    <ListItemText primary={t(d.title)}/>
                                </ListItem>)
                            }
                        </List>
                    </Box>
                </Drawer>
            </Hidden>
        </nav>
    )
}

export function Content(props: React.PropsWithChildren<{}>) {
    const classes = useStyles();
    return <div className={classes.content}>
        <AppBarSpace/>
        <React.Suspense fallback={<LinearProgress/>}>
            <Box paddingTop={1}>
                {props.children}
            </Box>
        </React.Suspense>
    </div>
}

export function Root(props: React.PropsWithChildren<{}>) {
    const classes = useStyles();
    return <div className={classes.root} children={props.children}/>
}

export function AppBarSpace() {
    const classes = useStyles();
    return <div className={classes.toolbar}/>
}

function DefaultAppBar(props: React.PropsWithChildren<Props> & { hideBackButton?: boolean }) {
    const {title} = props;
    const trigger = useScrollTrigger();
    const classes = useStyles();
    const history = useHistory();
    return (
        <Slide appear={false} direction="down" in={!trigger}>
            <AppBar className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    {!props.hideBackButton &&
                    <IconButton color="inherit" className={classes.menuButton} onClick={history.goBack}>
                        <ArrowBack/>
                    </IconButton>
                    }
                    <Typography color="inherit" variant="h6">{title}</Typography>
                    <Box mx="auto"/>
                    {props.children}
                </Toolbar>
                {props.multiLine}
            </AppBar>
        </Slide>
    )
}

export default DefaultAppBar;