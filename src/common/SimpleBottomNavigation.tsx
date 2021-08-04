import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import {useHistory} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {Paper} from "@material-ui/core";

const useStyles = makeStyles({
    root: {
        width: '100%',
        position: 'fixed',
        bottom: 0,
    }
});

export default function SimpleBottomNavigation() {
    const classes = useStyles();
    const history = useHistory();
    const {t} = useTranslation()
    const [value, setValue] = React.useState(0);
    const destinations = ["/", "/behavior", "/user"];

    return (
        <Paper className={classes.root} elevation={3}>
            <BottomNavigation
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                    const destination = destinations[newValue];
                    if (destination != null) {
                        history.push(destination);
                    }
                }}
                showLabels
            >
                <BottomNavigationAction label={t("home_title")} icon={<HomeOutlinedIcon />} />
                <BottomNavigationAction label={t("card_behavior_title")} icon={<EditOutlinedIcon />} />
                <BottomNavigationAction label={t("card_user_title")} icon={<PersonOutlineIcon />} />
            </BottomNavigation>
        </Paper>
    );
}
