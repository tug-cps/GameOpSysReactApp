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

export function translate(str: TranslatedString | undefined, override: string | undefined): string {
    if (override && override !== '') return override;
    if (!str) return ''

    const lang = i18next.language
    if (lang === 'de') return str.de;
    return str.en;
}

export function iconLookup(name?: string): JSX.Element {
    switch (name) {
        case 'laundry':
            return <LocalLaundryService/>
        case 'cooking':
            return <Restaurant/>
        case 'dishes':
            return <FreeBreakfast/>
        case 'hygiene':
            return <Bathtub/>
        case 'entertainment':
            return <Movie/>
        case 'wellness':
            return <Spa/>
        case 'homeoffice':
            return <Computer/>
        case 'misc':
            return <Help/>
        case 'temperature':
            return <AcUnitIcon/>
        case 'guests':
            return <Group/>
        default:
            return <Help/>
    }
}
