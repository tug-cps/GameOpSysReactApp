import {
    AppBar,
    Box,
    IconButton,
    ListItemIcon,
    Slide,
    SvgIcon,
    Toolbar,
    Typography,
    useMediaQuery,
    useScrollTrigger,
    useTheme
} from "@material-ui/core";
import {Link as RouterLink, useHistory} from "react-router-dom";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {useTranslation} from "react-i18next";
import {useNavDrawerDestinations} from "./Destinations";
import {ArrowBack, Menu} from "@material-ui/icons";

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
    const {goBack} = useHistory();
    const classes = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('xs'));
    const [state, setState] = React.useState({open: false});
    const {t} = useTranslation();
    const destinations = useNavDrawerDestinations();

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (event && event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
            return;
        }
        setState({...state, open: open});
    };

    if (props.hideBackButton === true) {
        if (matches) return null;
        return <React.Fragment>
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
                        {destinations.map((d) =>
                            <ListItem button key={d.title} component={RouterLink} to={d.to}>
                                <ListItemIcon><SvgIcon component={d.icon}/></ListItemIcon>
                                <ListItemText primary={t(d.title)}/>
                            </ListItem>)
                        }
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
                <Menu/>
            </IconButton>
        </React.Fragment>
    }
    return (
        <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="back"
            onClick={goBack}
        >
            <ArrowBack/>
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