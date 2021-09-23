import { Palette } from '@mui/material/styles';
import {TimeItem} from "./ThermostatDaySetting";

export const chartOptions = {
    plugins: {
        legend: {display: false},
        tooltip: {enabled: false}
    },
    scales: {
        x: {
            min: 0,
            max: 24,
            ticks: {
                stepSize: 2,
                callback: (value: any) => value + '⁰⁰'
            }
        },
        y: {
            ticks: {
                stepSize: 2,
                callback: (value: any) => value + ' °C'
            }
        }
    }
}

export const createData = (dataItems: TimeItem[], palette: Palette) => {
    return {
        datasets: [
            {
                data: dataItems.map((i) => ({
                    x: (i.time.getHours() + i.time.getMinutes() / 60),
                    y: i.temperature
                })),
                showLine: true,
                fill: true,
                stepped: true,
                borderColor: palette.primary.main,
                backgroundColor: palette.secondary.main,
            }
        ],

    }
}

