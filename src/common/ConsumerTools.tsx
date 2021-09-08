import {
    Bathtub,
    Computer,
    FreeBreakfast,
    Group,
    Help,
    LocalLaundryService,
    Movie,
    Restaurant,
    Spa
} from "@material-ui/icons";
import AcUnitIcon from "@material-ui/icons/AcUnit";
import {TranslatedString} from "../service/Model";
import i18next from "i18next";
import PowerIcon from "@material-ui/icons/Power";

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
    temperature: <AcUnitIcon/>,
    guests: <Group/>,
    emobility: <PowerIcon />
}

export function iconLookup(name?: string): JSX.Element {
    return name && name in icons ? icons[name] : <Help/>
}
