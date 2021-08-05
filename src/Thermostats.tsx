import React from 'react';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Container,
    Grid,
    GridSize,
    IconButton,
    Paper,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tabs, Toolbar,
    Typography
} from "@material-ui/core";
import DefaultAppBar from "./common/DefaultAppBar";
import DeleteIcon from "@material-ui/icons/Delete"
import EditIcon from "@material-ui/icons/Edit"

interface TimeItem {
    time: string;
    temperature: number;
}

interface DayProps {
    title: string;
    items: TimeItem[];
}

interface DayState {
}

class ThermostatDaySetting extends React.Component<DayProps, DayState> {
    render() {
        const {title, items} = this.props;
        return (
            <Card variant="outlined">
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">{title}</Typography>
                    <Paper square>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Zeitraum</TableCell>
                                    <TableCell colSpan={2}>Temperatur</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    items.map((item) => {
                                        return (
                                            <TableRow>
                                                <TableCell>{item.time}</TableCell>
                                                <TableCell>{item.temperature} °C</TableCell>
                                                <TableCell align="right">
                                                    <IconButton><EditIcon/></IconButton>
                                                    <IconButton><DeleteIcon/></IconButton>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                }
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
}

interface Props {

}

interface State {
    viewType: number;
}

function a11yProps(index: any) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && children}
        </div>
    );
}

interface TabModel {
    days: string[]
    md: GridSize
    lg: GridSize
    xl: GridSize
}

class Thermostats extends React.Component<Props, State> {
    render() {
        const items: TimeItem[] = [
            {
                time: '0:00 - 12:00',
                temperature: 18
            },
            {
                time: '12:00 - 15:00',
                temperature: 21
            },
            {
                time: '15:00 - 18:00',
                temperature: 25
            },
            {
                time: '18:00 - 24:00',
                temperature: 21
            },
        ]

        const viewType = this.state?.viewType | 0;

        const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
            this.setState({viewType: newValue})
        };

        const simpleDays = ["Werktage", "Wochenende"]
        const days = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"]
        const tabs: TabModel[] = [
            {days: simpleDays, md: 6, lg: 6, xl: 6},
            {days: days, md: 6, lg: 4, xl: 3}
        ]

        return (
            <div>
                <DefaultAppBar title='Thermostats'>
                    <Button color="inherit">Speichern</Button>
                </DefaultAppBar>
                <Toolbar>
                    <Box mx="auto"/>
                    <Tabs value={viewType} variant="fullWidth" onChange={handleChange}>
                        <Tab label="Einfach" {...a11yProps(0)}/>
                        <Tab label="Erweitert" {...a11yProps(1)}/>
                    </Tabs>
                    <Box mx="auto"/>
                </Toolbar>
                <Container disableGutters maxWidth="xl">
                    <Box p={1}>
                        {tabs.map((tab, index) => (
                            <TabPanel index={index} value={viewType}>
                                <Grid container spacing={1}>
                                    {tab.days.map((day) => (
                                        <Grid item xs={12} md={tab.md} lg={tab.lg} xl={tab.xl}>
                                            <ThermostatDaySetting title={day} items={items}/>
                                        </Grid>
                                    ))}
                                </Grid>
                            </TabPanel>
                        ))}
                    </Box>
                </Container>

            </div>
        )
    }
}

export default Thermostats;