import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import CloudUploadOutlinedIcon from "@material-ui/icons/CloudUploadOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import React from "react";
import AcUnitIcon from "@material-ui/icons/AcUnit";

export const bottomBarDestinations = [
    {label: 'home_link', icon: <HomeOutlinedIcon/>, to: '/'},
    {label: 'card_upload_title', icon: <CloudUploadOutlinedIcon/>, to: '/upload'},
    {label: 'card_behavior_title', icon: <EditOutlinedIcon/>, to: '/behavior'},
    {label: 'card_thermostats_title', icon: <AcUnitIcon/>, to: '/thermostats'},
    {label: 'card_user_title', icon: <PersonOutlineIcon/>, to: '/user'},
]

export const navDrawerDestinations = [
    {label: 'home_link', icon: <HomeOutlinedIcon/>, to: '/'},
    {label: 'card_upload_title', icon: <CloudUploadOutlinedIcon/>, to: '/upload'},
    {label: 'card_behavior_title', icon: <EditOutlinedIcon/>, to: '/behavior'},
    {label: 'card_thermostats_title', icon: <AcUnitIcon/>, to: '/thermostats'},
    {label: 'card_user_title', icon: <PersonOutlineIcon/>, to: '/user'},
]