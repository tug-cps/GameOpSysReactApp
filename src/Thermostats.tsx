import React, {useState} from 'react';
import {Box, Container, Grid, GridSize, Tab, Tabs, Toolbar} from "@material-ui/core";
import DefaultAppBar, {Content, Root} from "./common/DefaultAppBar";
import {ThermostatDaySetting, TimeItem} from "./thermostats/ThermostatDaySetting";
import useDefaultTracking from "./common/Tracking";
import {useTranslation} from "react-i18next";
import {InfoDialog, Lorem, useInfoDialog} from "./common/InfoDialog";
import {ResponsiveIconButton} from "./common/ResponsiveIconButton";
import {InfoOutlined, Replay, SaveAlt} from "@material-ui/icons";

interface Props {

}

interface State {
    viewType: number;
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
    const {Track} = useDefaultTracking({page: 'Power'});
    const {t} = useTranslation();
    const [state, setState] = useState({viewType: 0} as State);
    const [infoProps, openInfo] = useInfoDialog();
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
        <Track>
            <Root>
                <DefaultAppBar hideBackButton title={t('card_thermostats_title')}>
                    <ResponsiveIconButton description={t('info')} icon={<InfoOutlined/>} onClick={openInfo}/>
                    <ResponsiveIconButton description={t('try')} icon={<Replay/>}/>
                    <ResponsiveIconButton description={t('save')} icon={<SaveAlt/>}/>
                </DefaultAppBar>
                <Content>
                    <Toolbar>
                        <Box mx="auto"/>
                        <Tabs value={viewType} variant="fullWidth" onChange={handleChange}>
                            <Tab label="Einfach" id="simple-tab-0" aria-controls="simple-tabpanel-0"/>
                            <Tab label="Erweitert" id="simple-tab-1" aria-controls="simple-tabpanel-1"/>
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
                </Content>
            </Root>
            <InfoDialog title={t('info')} content={<Lorem/>} {...infoProps} />
        </Track>
    )
}

export default Thermostats;