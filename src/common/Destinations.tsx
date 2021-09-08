import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import CloudUploadOutlinedIcon from "@material-ui/icons/CloudUploadOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import React from "react";
import AcUnitIcon from "@material-ui/icons/AcUnit";
import ShowChartIcon from "@material-ui/icons/ShowChart";
import HistoryIcon from "@material-ui/icons/History";
import {Mood} from "@material-ui/icons";

const destinations = {
    home: {title: 'home_link', subtitle: '', icon: <HomeOutlinedIcon/>, to: '/'},
    upload: {title: 'card_upload_title', subtitle: 'card_upload_subtitle', icon: <CloudUploadOutlinedIcon/>, to: '/upload'},
    behavior: {title: 'card_behavior_title', subtitle: 'card_behavior_subtitle', icon: <EditOutlinedIcon/>, to: '/behavior'},
    thermostats: {title: 'card_thermostats_title', subtitle: 'card_thermostats_subtitle', icon: <AcUnitIcon/>, to: '/thermostats'},
    user: {title: 'card_user_title', subtitle: 'card_user_subtitle', icon: <PersonOutlineIcon/>, to: '/user'},
    power: {title: 'card_power_title', subtitle: 'card_power_subtitle', icon: ShowChartIcon, to: '/power'},
    archive: {title: 'card_archive_title', subtitle: 'card_archive_subtitle', icon: HistoryIcon, to: '/archive'},
    mood: {title: 'card_mood_title', subtitle: 'card_mood_subtitle', icon: Mood, to: '/mood'},
}

export const bottomBarDestinations = [
    destinations.home,
    destinations.upload,
    destinations.behavior,
    destinations.thermostats,
    destinations.user
]

export const navDrawerDestinations = [
    destinations.home,
    destinations.upload,
    destinations.behavior,
    destinations.thermostats,
    destinations.user
]

export const homeDestinations = [
    destinations.power,
    destinations.archive,
    destinations.mood
]