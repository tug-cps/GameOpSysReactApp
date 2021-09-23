import {Box, Paper, SvgIcon, useMediaQuery, useTheme} from "@mui/material";
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import React from 'react';
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import {useBottomBarDestinations} from "./Destinations";

function DefaultBottomNavigation() {

    const history = useHistory();
    const {t} = useTranslation()
    const [value, setValue] = React.useState(0);
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const destinations = useBottomBarDestinations();

    if (!matches) return null;
    return (
        (<>
            <Box sx={{marginTop: '60px'}}/>
            <Paper sx={{
                width: '100%',
                position: 'fixed',
                bottom: 0,
                overflow: 'hidden',
                zIndex: 100
            }} elevation={5}>
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
        </>)
    );
}

export default DefaultBottomNavigation;
