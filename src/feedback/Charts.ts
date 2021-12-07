import {useTheme} from "@mui/material";
import {blue, green, red, yellow} from "@mui/material/colors";
import {ChartOptions} from "chart.js";
import {useMemo} from "react";
import {useTranslation} from "react-i18next";

const getBackgroundColor = (self: number, others: number): string => {
    if (others <= 0) return red["800"];
    if (self / others >= 1.2) return red["800"];
    if (self / others <= 0.8) return green["800"];
    return yellow["800"]
}

export const useBarChartData = (data: { self: number, others: number }) => {
    const theme = useTheme();
    const {t} = useTranslation();
    return useMemo(() => ({
        labels: [t('feedback_energy_consumption')],
        datasets: [
            {
                label: t('feedback_my_energy_consumption'),
                data: [data.self],
                backgroundColor: getBackgroundColor(data.self, data.others),
                borderColor: theme.palette.background.paper,
            },
            {
                label: t('feedback_other_energy_consumption'),
                data: [data.others],
                backgroundColor: blue["800"],
                borderColor: theme.palette.background.paper,
            },
        ],
    }), [theme, data.self, data.others, t]);
};
export const usePieChartData = (data: { high: number, med: number, low: number }) => {
    const theme = useTheme();
    const {t} = useTranslation();
    return useMemo(() => ({
        labels: [t('feedback_high_energy'), t('feedback_med_energy'), t('feedback_low_energy')],
        datasets: [
            {
                data: [data.high, data.med, data.low].map(v => v * 100),
                backgroundColor: [green["800"], yellow["800"], red["800"]],
                borderColor: theme.palette.background.paper,
            },
        ],
    }), [theme, data.high, data.med, data.low, t]);
}
export const useBarChartOptions: () => ChartOptions<"bar"> = () => {
    const theme = useTheme();
    return useMemo(() => ({
        responsive: true,
        scales: {
            xAxis: {display: false},
            yAxis: {
                position: "right",
                grid: {
                    drawBorder: false,
                    color: theme.palette.divider
                },
                ticks: {
                    callback: tickValue => tickValue + " kWh",
                    padding: 10,
                    stepSize: 1,
                    color: theme.palette.text.primary,
                    font: {family: theme.typography.fontFamily}
                }
            },
        },
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: {family: theme.typography.fontFamily},
                    color: theme.palette.text.primary
                }
            },
            tooltip: {enabled: false},
            datalabels: {
                color: theme.palette.primary.contrastText,
                font: {
                    family: theme.typography.fontFamily,
                    size: 20,
                },
                formatter: value => value.toFixed(1) + " kWh"
            }
        }
    }), [theme]);
}
export const usePieChartOptions: () => ChartOptions<"pie"> = () => {
    const theme = useTheme();
    return useMemo(() => ({
        responsive: true,
        scales: {
            xAxis: {display: false},
            yAxis: {display: false}
        },
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: {family: theme.typography.fontFamily},
                    color: theme.palette.text.primary
                }
            },
            tooltip: {enabled: false},
            datalabels: {
                color: theme.palette.primary.contrastText,
                font: {
                    family: theme.typography.fontFamily,
                    size: 20,
                },
                formatter: value => value.toFixed(1) + "%"
            }
        }
    }), [theme]);
}
