import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import {useHistory} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {Paper, useMediaQuery, useTheme} from "@material-ui/core";
import {bottomBarDestinations} from "./Destinations";

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
    const matches = useMediaQuery(theme.breakpoints.down('xs'));
    if (!matches) return null;

    return (
        <React.Fragment>
            <div className={classes.spacer}/>
            <Paper className={classes.root} elevation={1}>
                <BottomNavigation
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                        const destination = bottomBarDestinations[newValue];
                        if (destination != null) {
                            history.push(destination.to);
                        }
                    }}
                    showLabels
                >
                    {bottomBarDestinations.map((d) => <BottomNavigationAction label={t(d.label)} icon={d.icon}/>)}
                </BottomNavigation>
            </Paper>
        </React.Fragment>
    );
}

export default DefaultBottomNavigation;