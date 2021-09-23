import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import {useHistory} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {Paper, SvgIcon, useMediaQuery, useTheme} from "@mui/material";
import {useBottomBarDestinations} from "./Destinations";

const useStyles = makeStyles({
    root: {
        width: '100%',
        position: 'fixed',
        bottom: 0,
        overflow: 'hidden',
        zIndex: 100
    },
    spacer: {
        marginTop: '60px'
    },
});

function DefaultBottomNavigation() {
    const classes = useStyles();
    const history = useHistory();
    const {t} = useTranslation()
    const [value, setValue] = React.useState(0);
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const destinations = useBottomBarDestinations();

    if (!matches) return null;
    return (
        <>
            <div className={classes.spacer}/>
            <Paper className={classes.root} elevation={5}>
                <BottomNavigation
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                        const destination = destinations[newValue];
                        if (destination != null) {
                            history.push(destination.to);
                        }
                    }}
                    showLabels
                >
                    {destinations.map((d) =>
                        <BottomNavigationAction id={d.title} label={t(d.title)} icon={<SvgIcon component={d.icon}/>}/>)
                    }
                </BottomNavigation>
            </Paper>
        </>
    );
}

export default DefaultBottomNavigation;
