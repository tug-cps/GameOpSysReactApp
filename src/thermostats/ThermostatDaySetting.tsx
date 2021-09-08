import React from "react";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    useTheme
} from "@material-ui/core";
import {Scatter} from "react-chartjs-2";
import {Delete, Edit} from "@material-ui/icons";

export interface TimeItem {
    time: string;
    temperature: number;
}

interface Props {
    title: string;
    items: TimeItem[];
}

const options = {
    locale: "de",
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            enabled: false
        }
    },
    scales: {
        xAxes: {
            min: 0,
            max: 24,
            ticks: {
                callback: (value: any) => value + ':00'
            }
        },
        yAxes: {
            suggestedMax: 22,
            suggestedMin: 22,
            ticks: {
                callback: (value: any) => value + ' °C'
            }
        }
    }
}

export function ThermostatDaySetting(props: Props) {
    const {title, items} = props;
    const dataItems = [...items, {time: '24:00', temperature: items[items.length - 1].temperature}]
    const {palette} = useTheme();
    const data = {
        datasets: [
            {
                data: dataItems.map((i) => ({
                    x: (+i.time.substring(0, i.time.indexOf(':'))),
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

    return (
        <Card variant="outlined">
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">{title}</Typography>
                <Paper square>
                    <Box p={1}>
                        <Scatter data={data} options={options} height={50}/>
                    </Box>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Zeitraum</TableCell>
                                <TableCell colSpan={2}>Temperatur</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map((item, index) => (
                                <TableRow key={item.time} hover={true}>
                                    <TableCell>{item.time}</TableCell>
                                    <TableCell>{item.temperature} °C</TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small"><Edit/></IconButton>
                                        <IconButton disabled={index < 1} size="small"><Delete/></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>

                <CardActions>
                    <Button style={{flexShrink: 0}} color="primary">Zeitraum hinzufügen</Button>
                    <Box mx="auto"/>
                    <Button color="primary">Kopieren von ...</Button>
                </CardActions>
            </CardContent>
        </Card>
    )
}
