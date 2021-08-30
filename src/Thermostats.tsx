import React, {useState} from 'react';
import {Box, Button, Container, Grid, GridSize, Tab, Tabs, Toolbar} from "@material-ui/core";
import DefaultAppBar from "./common/DefaultAppBar";
import {ThermostatDaySetting, TimeItem} from "./ThermostatDaySetting";

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

function Thermostats(props: Props) {
    const [state, setState] = useState({viewType: 0} as State);
    const items: TimeItem[] = [
        {
            time: '0:00',
            temperature: 18
        },
        {
            time: '12:00',
            temperature: 21
        },
        {
            time: '15:00',
            temperature: 25
        },
        {
            time: '18:00',
            temperature: 21
        },
    ]

    const viewType = state.viewType | 0;
    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setState({viewType: newValue})
    };

    const simpleDays = ["Werktage", "Wochenende"]
    const days = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"]
    const tabs: TabModel[] = [
        {days: simpleDays, md: 6, lg: 6, xl: 6},
        {days: days, md: 6, lg: 4, xl: 3}
    ]

    return (
        <React.Fragment>
            <DefaultAppBar title='Thermostats'>
                <Button color="inherit">Ausprobieren</Button>
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
                        <TabPanel index={index} value={viewType} key={index}>
                            <Grid container spacing={1}>
                                {tab.days.map((day) => (
                                    <Grid item xs={12} md={tab.md} lg={tab.lg} xl={tab.xl} key={day}>
                                        <ThermostatDaySetting title={day} items={items}/>
                                    </Grid>
                                ))}
                            </Grid>
                        </TabPanel>
                    ))}
                </Box>
            </Container>
        </React.Fragment>
    )
}

export default Thermostats;