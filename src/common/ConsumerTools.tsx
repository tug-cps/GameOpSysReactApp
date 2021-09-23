import {
    AcUnit,
    Bathtub,
    Computer,
    FreeBreakfast,
    Group,
    Help,
    LocalLaundryService,
    Movie,
    Power,
    Restaurant,
    Spa
} from "@mui/icons-material";
import {TranslatedString} from "../service/Model";
import i18next from "i18next";
import {blue, green, orange, pink, purple, red, teal} from "@mui/material/colors";

export function translate(str: TranslatedString | undefined, override: string | undefined): string {
    if (override && override !== '') return override;
    if (!str) return ''

    const lang = i18next.language
    if (lang === 'de') return str.de;
    return str.en;
}

const icons: any = {
    laundry: <LocalLaundryService/>,
    cooking: <Restaurant/>,
    dishes: <FreeBreakfast/>,
    hygiene: <Bathtub/>,
    entertainment: <Movie/>,
    wellness: <Spa/>,
    homeoffice: <Computer/>,
    misc: <Help/>,
    temperature: <AcUnit/>,
    guests: <Group/>,
    emobility: <Power/>
}

function hashCode(s: string) {
    let h = 0, l = s.length, i = 0;
    if (l > 0) while (i < l) h = (h << 5) - h + s.charCodeAt(i++) | 0;
    return h;
}

const colors = [
    pink[500],
    purple[500],
    orange[500],
    teal[500],
    green[500],
    red[500],
    blue[500],
]

export function backgroundColor(id: string) {
    return colors[hashCode(id) % colors.length | 0]
}

export function iconLookup(name?: string): JSX.Element {
    return name && name in icons ? icons[name] : <Help/>
}
