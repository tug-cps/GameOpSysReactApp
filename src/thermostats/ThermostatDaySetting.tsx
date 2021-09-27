import {Add, Delete, Edit} from "@mui/icons-material";
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
            <CardHeader title={title}/>
            <CardContent>
                <Scatter data={data} options={chartOptions} height={50}/>
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
            </CardContent>
            <CardActions>
                <Button
                    color="primary"
                    onClick={() => props.onCopyFrom(props.id)}
                >Kopiere von ...</Button>
                <Box mx="auto"/>
                <Tooltip title="Zeitraum hinzufügen">
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
