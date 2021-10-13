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
import i18next from "i18next";
import {TranslatedString} from "../service/Model";

export function translate(str: TranslatedString | undefined, override: string | undefined): string {
    if (override && override !== '') return override;
    if (!str) return ''

    const lang = i18next.language
    if (lang === 'de') return str.de;
    return str.en;
}

const shadeDefault = 500;
const shadeAlt = 400;

const consumers: any = {
    laundry: {icon: <LocalLaundryService/>, color: blue[shadeDefault], colorAlt: blue[shadeAlt]},
    cooking: {icon: <Restaurant/>, color: pink[shadeDefault], colorAlt: pink[shadeAlt]},
    dishes: {icon: <FreeBreakfast/>, color: purple[shadeDefault], colorAlt: purple[shadeAlt]},
    hygiene: {icon: <Bathtub/>, color: blue[shadeDefault], colorAlt: blue[shadeAlt]},
    entertainment: {icon: <Movie/>, color: teal[shadeDefault], colorAlt: teal[shadeAlt]},
    wellness: {icon: <Spa/>, color: green[shadeDefault], colorAlt: green[shadeAlt]},
    homeoffice: {icon: <Computer/>, color: red[shadeDefault], colorAlt: red[shadeAlt]},
    emobility: {icon: <Power/>, color: blue[shadeDefault], colorAlt: blue[shadeAlt]},
    temperature: {icon: <AcUnit/>, color: pink[shadeDefault], colorAlt: pink[shadeAlt]},
    high: {icon: <Help/>, color: red[shadeDefault], colorAlt: red[shadeAlt]},
    med: {icon: <Help/>, color: amber[shadeDefault], colorAlt: amber[shadeAlt]},
    low: {icon: <Help/>, color: green[shadeDefault], colorAlt: green[shadeAlt]},
    unknown: {icon: <Help/>, color: purple[shadeDefault], colorAlt: purple[shadeAlt]}
}

export const consumerLookup = (type: string) => type in consumers ? consumers[type] : consumers.unknown

export function backgroundColor(type: string) {
    return type in consumers ? consumers[type].color : "#0ff";
}

export function iconLookup(type: string): JSX.Element {
    return type in consumers ? consumers[type].icon : <Help/>
}
