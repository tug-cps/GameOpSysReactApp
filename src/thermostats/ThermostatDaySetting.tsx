import Add from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    useTheme
} from "@mui/material";
import React from "react";
import {Scatter} from "react-chartjs-2";
import {useTranslation} from "react-i18next";
import {createTime} from "../common/Time";
import {TimeItem} from "../service/Model";
import {chartOptions, createData} from "./ChartOptions";

interface LabeledTimeItem extends TimeItem {
    label: string
}

interface Props {
    title: string;
    id: string;
    items: TimeItem[];
    onAddTime: (id: string) => void
    onCopyFrom: (id: string) => void
    onDelete: (id: string, index: number) => void
    onEdit: (id: string, index: number) => void
}

const printTime = (time: Date) => time.toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'})
const labelTimeItems = (array: TimeItem[]): LabeledTimeItem[] => array.map((value, index) => ({
    ...value, label: `${printTime(value.time)} - ${printTime(array[index + 1]?.time ?? createTime(23, 59))}`
}))

const compareItem = (a: TimeItem, b: TimeItem) => a.time.getTime() === b.time.getTime() && a.temperature === b.temperature
export const compareProps = (a: Props, b: Props) =>
    a.id === b.id && a.title === b.title && a.items.length === b.items.length &&
    a.items.every((value, index) => compareItem(value, b.items[index]))

export const ThermostatDaySetting = React.memo((props: Props) => {
    const {palette} = useTheme();
    const {t} = useTranslation();
    const {title, items} = props;

    const labeledTimeItems = labelTimeItems(items);
    const dataItems = [...items, {time: createTime(23, 59), temperature: items[items.length - 1].temperature}]
    const data = createData(dataItems, palette);
    return (
        <Card>
            <CardHeader title={title}/>
            <CardContent>
                <Scatter data={data} options={chartOptions} height={50}/>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('thermostat_timespan')}</TableCell>
                            <TableCell colSpan={2}>{t('thermostat_temperature')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {labeledTimeItems.map((item, index) => (
                            <TableRow key={index} hover={true}>
                                <TableCell>{item.label}</TableCell>
                                <TableCell>{item.temperature} °C</TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        size="small"
                                        onClick={() => props.onEdit(props.id, index)}
                                    ><Edit/></IconButton>
                                    <IconButton
                                        disabled={index < 1}
                                        size="small"
                                        onClick={() => props.onDelete(props.id, index)}
                                    ><Delete/></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <CardActions>
                <Button
                    color="primary"
                    onClick={() => props.onCopyFrom(props.id)}
                >{t('thermostat_copy_from')}</Button>
                <Box mx="auto"/>
                <Tooltip title={t('thermostat_insert_timespan') as string}>
                    <IconButton
                        sx={{marginLeft: "auto"}}
                        onClick={() => props.onAddTime(props.id)}
                        disabled={items?.length > 4}
                    ><Add/></IconButton>
                </Tooltip>
            </CardActions>
        </Card>
    )
}, compareProps)
