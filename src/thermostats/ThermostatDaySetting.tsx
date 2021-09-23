import React from "react";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    useTheme
} from "@mui/material";
import {Scatter} from "react-chartjs-2";
import {Delete, Edit} from "@mui/icons-material";
import {chartOptions, createData} from "./ChartOptions";
import {createTime} from "../common/Time";

export interface TimeItem {
    time: Date;
    temperature: number;
}

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

const labelTimeItems = (dataItems: TimeItem[]): LabeledTimeItem[] => {
    let array = new Array<LabeledTimeItem>();
    for (let _i = 0; _i < dataItems.length - 1; _i++) {
        array.push({...dataItems[_i], label: printTime(dataItems[_i].time) + ' - ' + printTime(dataItems[_i + 1].time)})
    }
    return array;
}

export const compareProps = (a: Props, b: Props) => {
    if (a.id !== b.id || a.title !== b.title || a.items.length !== b.items.length) return false;
    for (let i = 0; i < a.items.length; i++) {
        if (a.items[i].time.getTime() !== b.items[i].time.getTime() || a.items[i].temperature !== b.items[i].temperature) return false;
    }
    return true;
}

export const ThermostatDaySetting = React.memo((props: Props) => {
    const {title, items} = props;
    const dataItems = [...items, {time: createTime(23, 59), temperature: items[items.length - 1].temperature}]
    const labeledTimeItems = labelTimeItems(dataItems);
    const {palette} = useTheme();
    const data = createData(dataItems, palette);
    return (
        <Card>
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">{title}</Typography>
                <Box p={1}>
                    <Scatter data={data} options={chartOptions} height={50}/>
                </Box>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Zeitraum</TableCell>
                            <TableCell colSpan={2}>Temperatur</TableCell>
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
                <Box my="auto" />
                <CardActions>
                    <Button
                        style={{flexShrink: 0}}
                        color="primary"
                        onClick={() => props.onAddTime(props.id)}
                        disabled={items?.length > 4}
                    >Zeitraum hinzufügen</Button>
                    <Box mx="auto"/>
                    <Button
                        color="primary"
                        onClick={() => props.onCopyFrom(props.id)}
                    >Kopieren von ...</Button>
                </CardActions>
            </CardContent>
        </Card>
    )
}, compareProps)
