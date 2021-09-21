import {
    AcUnit,
    CloudUploadOutlined,
    EditOutlined,
    History,
    HomeOutlined,
    Mood,
    PersonOutline,
    ShowChart,
    SvgIconComponent
} from "@material-ui/icons";
import {useContext} from "react";
import {UserContext} from "../App";

interface Destination {
    title: string,
    subtitle: string,
    icon: SvgIconComponent,
    to: string
}

const destinations = {
    home: {title: 'home_link', subtitle: '', icon: HomeOutlined, to: '/'},
    upload: {title: 'card_upload_title', subtitle: 'card_upload_subtitle', icon: CloudUploadOutlined, to: '/upload'},
    behavior: {title: 'card_behavior_title', subtitle: 'card_behavior_subtitle', icon: EditOutlined, to: '/behavior'},
    thermostats:
        {title: 'card_thermostats_title', subtitle: 'card_thermostats_subtitle', icon: AcUnit, to: '/thermostats'},
    user: {title: 'card_user_title', subtitle: 'card_user_subtitle', icon: PersonOutline, to: '/user'},
    power: {title: 'card_power_title', subtitle: 'card_power_subtitle', icon: ShowChart, to: '/power'},
    archive: {title: 'card_archive_title', subtitle: 'card_archive_subtitle', icon: History, to: '/archive'},
    mood: {title: 'card_mood_title', subtitle: 'card_mood_subtitle', icon: Mood, to: '/mood'},
}

export function useBottomBarDestinations(): Destination[] {
    const user = useContext(UserContext)
    switch (user?.type) {
        case "management":
            return [destinations.home, destinations.upload, destinations.user];
        case "student":
            return [destinations.home, destinations.behavior, destinations.user];
        case "homeowner":
            return [destinations.home, destinations.upload, destinations.behavior, destinations.thermostats, destinations.user];
        default:
            return [];
    }
}


export function useNavDrawerDestinations(): Destination[] {
    const user = useContext(UserContext)
    switch (user?.type) {
        case "management":
            return [destinations.home, destinations.upload, destinations.user];
        case "student":
            return [destinations.home, destinations.behavior, destinations.user];
        case "homeowner":
            return [destinations.home, destinations.upload, destinations.behavior, destinations.thermostats, destinations.user];
        default:
            return [];
    }
}

export function useHomeDestinations(): Destination[] {
    const user = useContext(UserContext)
    switch (user?.type) {
        case "management":
            return [destinations.upload, destinations.user]
        case "student":
            return [destinations.archive, destinations.mood]
        case "homeowner":
            return [destinations.power, destinations.upload, destinations.mood]
        default:
            return []
    }
}

