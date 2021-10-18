import ArrowBack from "@mui/icons-material/ArrowBack";
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
} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import {useTranslation} from "react-i18next";
import {Link as RouterLink, useHistory} from "react-router-dom";
import {useNavDrawerDestinations} from "./Destinations";

const drawerWidth = 240;

export interface Props {
    hideBackButton?: boolean;
    title: string;
}

export const DefaultDrawer = React.memo(() => {
    const {t} = useTranslation();
    const destinations = useNavDrawerDestinations();

    return (
        <Box component='nav' sx={{flexShrink: {sm: 0}, width: {sm: drawerWidth}}}>
            <Hidden smDown>
                <Drawer open variant="persistent">
                    <Box role="presentation" sx={{width: drawerWidth}}>
                        <Toolbar/>
                        <Divider/>
                        <List disablePadding>
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
        </Box>
    );
}, () => true);

export function Content(props: React.PropsWithChildren<{}>) {
    return <Box sx={{flexGrow: 1}}>
        <Toolbar/>
        <React.Suspense fallback={<LinearProgress/>} children={props.children}/>
    </Box>
}

export function Root(props: React.PropsWithChildren<{}>) {
    return <Box sx={{display: 'flex'}} children={props.children}/>
}

const style = {ml: {sm: `${drawerWidth}px`}, width: {sm: `calc(100% - ${drawerWidth}px)`}};

export function DefaultAppBar(props: React.PropsWithChildren<Props> & { hideBackButton?: boolean }) {
    const {title} = props;
    const trigger = useScrollTrigger();

    const history = useHistory();
    return (
        <Slide appear={false} direction="down" in={!trigger}>
            <AppBar sx={style}>
                <Toolbar>
                    {!props.hideBackButton &&
                    <IconButton
                        color="inherit"
                        edge="start"
                        sx={{marginRight: 2}}
                        onClick={history.goBack}
                        size="large"
                        children={<ArrowBack/>}
                    />
                    }
                    <Typography color="inherit" variant="h6">{title}</Typography>
                    <Box mx="auto"/>
                    {props.children}
                </Toolbar>
            </AppBar>
        </Slide>
    );
}
