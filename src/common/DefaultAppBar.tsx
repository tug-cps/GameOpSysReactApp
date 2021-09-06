import {
    AppBar,
    Box,
    IconButton,
    Slide,
    Toolbar,
    Typography,
    useMediaQuery,
    useScrollTrigger,
    useTheme
} from "@material-ui/core";
import {Link as RouterLink, useHistory} from "react-router-dom";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import MenuIcon from '@material-ui/icons/Menu';
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {useTranslation} from "react-i18next";
import {navDrawerDestinations} from "./BottomBarDestinations";

const useStyles = makeStyles(theme => ({
        menuButton: {
            marginRight: theme.spacing(2),
        },
        menu: {
            width: 250
        }
    })
);

export interface Props {
    hideBackButton?: boolean;
    title: string;
    multiLine?: React.ReactNode;
}

function MenuButton(props: { hideBackButton?: boolean }) {
    const history = useHistory();
    const classes = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('xs'));
    const [state, setState] = React.useState({open: false});
    const {t} = useTranslation();

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (event && event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
            return;
        }
        setState({...state, open: open});
    };

    if (props.hideBackButton === true) {
        if (!matches) {
            return (
                <React.Fragment>
                    <SwipeableDrawer
                        anchor="left"
                        open={state.open}
                        onClose={toggleDrawer(false)}
                        onOpen={toggleDrawer(true)}
                    >
                        <Box
                            onClick={toggleDrawer(false)}
                            onKeyDown={toggleDrawer(false)}
                            role="presentation"
                            className={classes.menu}
                        >
                            <List>
                                {navDrawerDestinations.map((d) => (
                                    <ListItem button key={d.label} component={RouterLink} to={d.to}>
                                        <ListItemIcon>{d.icon}</ListItemIcon>
                                        <ListItemText primary={t(d.label)}/>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>

                    </SwipeableDrawer>
                    <IconButton
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="open Menu"
                        onClick={toggleDrawer(true)}
                    >
                        <MenuIcon/>
                    </IconButton>
                </React.Fragment>
            )
        } else {
            return null;
        }
    }
    return (
        <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="back"
            onClick={() => history.go(-1)}
        >
            <ArrowBackIcon/>
        </IconButton>
    )
}


function DefaultAppBar(props: React.PropsWithChildren<Props>) {
    const {title} = props;
    const trigger = useScrollTrigger();
    return (
        <React.Fragment>
            <Slide appear={false} direction="down" in={!trigger}>
                <AppBar>
                    <Toolbar>
                        <MenuButton hideBackButton={props.hideBackButton}/>
                        <Typography color="inherit" variant="h6">{title}</Typography>
                        <Box mx="auto"/>
                        {props.children}
                    </Toolbar>
                    {props.multiLine}
                </AppBar>
            </Slide>
            <Toolbar style={{visibility: "hidden"}}/>
        </React.Fragment>
    )
}

export default DefaultAppBar;