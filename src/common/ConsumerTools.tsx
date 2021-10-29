import AcUnit from "@mui/icons-material/AcUnit";
import Bathtub from "@mui/icons-material/Bathtub";
import Computer from "@mui/icons-material/Computer";
import FreeBreakfast from "@mui/icons-material/FreeBreakfast";
import Help from "@mui/icons-material/Help";
import LocalLaundryService from "@mui/icons-material/LocalLaundryService";
import Movie from "@mui/icons-material/Movie";
import Power from "@mui/icons-material/Power";
import Restaurant from "@mui/icons-material/Restaurant";
import Spa from "@mui/icons-material/Spa";
import {amber, blue, green, pink, purple, red, teal} from "@mui/material/colors";

const shadeDefault = 500;
const shadeAlt = 400;

interface Consumer {
    icon: JSX.Element
    tKey: string
    color: string
    colorAlt: string
}

const consumers: { [index: string]: Consumer } = {
    laundry: {
        icon: <LocalLaundryService/>,
        tKey: 'consumer_type_laundry',
        color: blue[shadeDefault],
        colorAlt: blue[shadeAlt]
    },
    cooking: {
        icon: <Restaurant/>,
        tKey: 'consumer_type_cooking',
        color: pink[shadeDefault],
        colorAlt: pink[shadeAlt]
    },
    dishes: {
        icon: <FreeBreakfast/>,
        tKey: 'consumer_type_dishes',
        color: purple[shadeDefault],
        colorAlt: purple[shadeAlt]
    },
    hygiene: {
        icon: <Bathtub/>,
        tKey: 'consumer_type_hygiene',
        color: blue[shadeDefault],
        colorAlt: blue[shadeAlt]
    },
    entertainment: {
        icon: <Movie/>,
        tKey: 'consumer_type_entertainment',
        color: teal[shadeDefault],
        colorAlt: teal[shadeAlt]
    },
    wellness: {
        icon: <Spa/>,
        tKey: 'consumer_type_wellness',
        color: green[shadeDefault],
        colorAlt: green[shadeAlt]
    },
    homeoffice: {
        icon: <Computer/>,
        tKey: 'consumer_type_homeoffice',
        color: red[shadeDefault],
        colorAlt: red[shadeAlt]
    },
    emobility: {
        icon: <Power/>,
        tKey: 'consumer_type_emobility',
        color: blue[shadeDefault],
        colorAlt: blue[shadeAlt]
    },
    temperature: {
        icon: <AcUnit/>,
        tKey: 'consumer_type_temperature',
        color: pink[shadeDefault],
        colorAlt: pink[shadeAlt]
    },
    high: {
        icon: <Help/>,
        tKey: 'consumer_type_high',
        color: red[shadeDefault],
        colorAlt: red[shadeAlt]
    },
    med: {
        icon: <Help/>,
        tKey: 'consumer_type_med',
        color: amber[shadeDefault],
        colorAlt: amber[shadeAlt]
    },
    low: {
        icon: <Help/>,
        tKey: 'consumer_type_low',
        color: green[shadeDefault],
        colorAlt: green[shadeAlt]
    },
    unknown: {
        icon: <Help/>,
        tKey: 'consumer_type_unknown',
        color: purple[shadeDefault],
        colorAlt: purple[shadeAlt]
    }
}

export const consumerLookup = (type: string): Consumer => type in consumers ? consumers[type] : consumers.unknown
