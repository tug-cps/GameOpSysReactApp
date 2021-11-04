import {useTheme} from "@mui/material";
import {ChartData, ChartOptions} from "chart.js";
import {useMemo} from "react";
import {useTranslation} from "react-i18next";

export const useData: (x: number, y: number) => ChartData<"bubble"> = (x, y) => {
    const theme = useTheme();
    return useMemo(() => ({
        datasets: [{
            data: [{x, y, r: 20}],
            borderWidth: 1,
            borderColor: theme.palette.divider,
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.primary.main,
            pointHitRadius: 25,
            hoverRadius: 0,
        }]
    }), [theme, x, y]);
}
export const useOptions: (onChange: (value: { x: number, y: number }) => void) => ChartOptions<"bubble"> = (onChange) => {
    const {t} = useTranslation();
    return useMemo(() => ({
        maintainAspectRatio: true,
        aspectRation: 1,
        scales: {
            xScale: {
                alignToPixels: true,
                max: 10,
                min: 0,
                ticks: {display: false},
                grid: {display: false},
                title: {
                    display: true,
                    text: t('mood_very_cold') + ' ⟵      ⟶ ' + t('mood_very_hot'),
                },
            },
            yScale: {
                alignToPixels: true,
                max: 10,
                min: 0,
                ticks: {display: false},
                grid: {display: false},
                title: {
                    display: true,
                    text: [t('mood_very_uncomfortable') + ' ⟵      ⟶ ' + t('mood_very_comfortable')],
                },
            }
        },
        onHover: function (e: any) {
            const point = e.chart.getElementsAtEventForMode(e, 'nearest', {intersect: true}, false)
            if (point.length) e.native.target.style.cursor = 'grab'
            else e.native.target.style.cursor = 'default'
        },
        plugins: {
            dragData: {
                dragX: true,
                showTooltip: false,
                onDragStart: () => null,
                onDrag: () => null,
                onDragEnd: (e: any, datasetIndex: any, index: number, value: { x: number, y: number, r: number }) => {
                    e.target.style.cursor = 'default'
                    onChange(value);
                },
            },
            legend: {display: false},
            tooltip: {enabled: false}
        }
    }), [onChange, t]);
}
