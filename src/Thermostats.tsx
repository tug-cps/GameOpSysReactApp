import React, {useCallback, useEffect, useState} from 'react';
import {Box, Container, Dialog, DialogTitle, Grid, GridSize, Tab, Tabs, Toolbar} from "@material-ui/core";
import {ThermostatDaySetting, TimeItem} from "./thermostats/ThermostatDaySetting";
import useDefaultTracking from "./common/Tracking";
import {useTranslation} from "react-i18next";
import {InfoDialog, Lorem, useInfoDialog} from "./common/InfoDialog";
import {ResponsiveIconButton} from "./common/ResponsiveIconButton";
import {CheckOutlined, InfoOutlined, RotateLeft, SaveAlt} from "@material-ui/icons";
import BackendService from "./service/BackendService";
import {AppBarProps} from "./App";
import {AddTimeDialog} from "./thermostats/AddTimeDialog";
import {createTime} from "./common/Time";
import {data_} from "./thermostats/DummyData";

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

interface DayModel {
    id: string
    label: string
    data: Array<TimeItem>
}

interface TabModel {
    days: Array<DayModel>
    md: GridSize
    lg: GridSize
    xl: GridSize
}

interface Props {
    backendService: BackendService
    setAppBar: (props: AppBarProps) => void
}

function Thermostats(props: Props) {
    const {Track} = useDefaultTracking({page: 'Power'});
    const {t} = useTranslation();
    const [activeTab, setActiveTab] = useState(0);
    const [infoProps, openInfo] = useInfoDialog();
    const [data, setData] = useState<Array<Array<TimeItem>>>([])
    const [initialData, setInitialData] = useState<Array<Array<TimeItem>>>([])
    const {setAppBar} = props;

    const simpleDayLabels = ["Werktage", "Wochenende"]
    const dayLabels = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"]

    useEffect(() => {
        setData(data_);
        setInitialData(data_);
    }, [])

    const empty = [{time: createTime(0, 0), temperature: 21}]
    const days = dayLabels.map((value, index) => ({
        id: String(index),
        label: value,
        data: data.length < index ? empty : data[index]
    }))
    const simpleDays = simpleDayLabels.map((value, index) => ({
        id: String(index + 10),
        label: value,
        data: empty
    }))
    const tabs: TabModel[] = [
        {days: simpleDays, md: 6, lg: 6, xl: 6},
        {days: days, md: 6, lg: 4, xl: 3}
    ]

    const reset = useCallback(() => {
        console.log(initialData);
        setData(initialData);
    }, [initialData]);

    useEffect(() => {
        setAppBar({
            title: t('card_thermostats_title'),
            showBackButton: false,
            children: () => <>
                <ResponsiveIconButton description={t('info')} icon={<InfoOutlined/>} onClick={openInfo}/>
                <ResponsiveIconButton description={t('reset')} icon={<RotateLeft/>} onClick={reset}/>
                <ResponsiveIconButton description={t('try')} icon={<CheckOutlined/>}/>
                <ResponsiveIconButton description={t('save')} icon={<SaveAlt/>}/>
            </>
        })
    }, [t, openInfo, reset, setAppBar]);

    const [addTimeOpen, setAddTimeOpen] = useState(false);
    const [copyFromOpen, setCopyFromOpen] = useState(false);

    const onAddTime = useCallback((id: string) => {
        setAddTimeOpen(true);
        setShowTimePicker(true);
        setTemperature("21");
        setTime(createTime(12, 0));
    }, []);
    const onCopyFrom = useCallback((id: string) => setCopyFromOpen(true), []);
    const onDelete = useCallback((id: string, index: number) => {
        console.log("id", id, "index", index)
        setData(prevState =>
            prevState.map((item, idx) =>
                String(idx) === id ? item.filter((value, refIndex) => refIndex !== index) : item
            )
        );
    }, [])

    const [time, setTime] = useState<Date | null>(new Date());
    const [temperature, setTemperature] = useState<string | null>("21");
    const [showTimePicker, setShowTimePicker] = useState(false);

    return (
        <Track>
            <Toolbar>
                <Box mx="auto"/>
                <Tabs value={activeTab} variant="fullWidth" onChange={(e, tab) => setActiveTab(tab)}>
                    <Tab label="Einfach" id="simple-tab-0" aria-controls="simple-tabpanel-0"/>
                    <Tab label="Erweitert" id="simple-tab-1" aria-controls="simple-tabpanel-1"/>
                </Tabs>
                <Box mx="auto"/>
            </Toolbar>
            <Container disableGutters maxWidth="xl">
                <Box p={1}>
                    {tabs.map((tab, index) => (
                        <TabPanel index={index} value={activeTab} key={index}>
                            <Grid container spacing={1}>
                                {tab.days.map((day) => (
                                    <Grid item xs={12} md={tab.md} lg={tab.lg} xl={tab.xl} key={day.id}>
                                        <ThermostatDaySetting
                                            id={day.id}
                                            title={day.label}
                                            items={day.data}
                                            onAddTime={onAddTime}
                                            onCopyFrom={onCopyFrom}
                                            onEdit={(id, index) => {
                                                setTime(day.data[index].time);
                                                setTemperature(String(day.data[index].temperature));
                                                setShowTimePicker(index > 0);
                                                setAddTimeOpen(true);
                                            }}
                                            onDelete={onDelete}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </TabPanel>
                    ))}
                </Box>
            </Container>
            <AddTimeDialog
                title="Add Entry"
                onOK={() => {
                }}
                onClose={() => setAddTimeOpen(false)}
                open={addTimeOpen}
                showTimePicker={showTimePicker}
                setTemperature={setTemperature}
                temperature={temperature}
                setTime={(time) => {
                    setTime(time);
                    console.log(time);
                }}
                time={time}
            />
            <Dialog open={copyFromOpen} onClose={() => setCopyFromOpen(false)}>
                <DialogTitle>Copy From</DialogTitle>
            </Dialog>
            <InfoDialog title={t('info')} content={<Lorem/>} {...infoProps} />
        </Track>
    )
}

export default Thermostats;