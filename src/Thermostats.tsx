import React, {useCallback, useEffect, useState} from 'react';
import {Box, Container, Dialog, DialogTitle, Grid, GridSize, Tab, Tabs, Toolbar} from "@material-ui/core";
import {ThermostatDaySetting, TimeItem} from "./thermostats/ThermostatDaySetting";
import useDefaultTracking from "./common/Tracking";
import {useTranslation} from "react-i18next";
import {InfoDialog, Lorem, useInfoDialog} from "./common/InfoDialog";
import {ResponsiveIconButton} from "./common/ResponsiveIconButton";
import {CompareArrowsOutlined, InfoOutlined, RotateLeft, SaveAlt} from "@material-ui/icons";
import {PrivateRouteProps} from "./App";
import {ModifyTimeItemDialog} from "./thermostats/ModifyTimeItemDialog";
import {createTime} from "./common/Time";
import {data_} from "./thermostats/DummyData";
import {AlertSnackbar} from "./common/AlertSnackbar";
import {useSnackBar} from "./common/UseSnackBar";

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

interface Props extends PrivateRouteProps {
}

const copyData = (data: Array<Array<TimeItem>>) => data.map((day) => day.map((e) => ({...e})))
const sortDay = (day: Array<TimeItem>) => day.sort((a, b) => a.time.getHours() > b.time.getHours() || (a.time.getHours() === b.time.getHours() && a.time.getMinutes() >= b.time.getMinutes()) ? 1 : -1)

function Thermostats(props: Props) {
    const {Track} = useDefaultTracking({page: 'Power'});
    const {t} = useTranslation();
    const [activeTab, setActiveTab] = useState(0);
    const [infoProps, openInfo] = useInfoDialog();
    const [data, setData] = useState<Array<Array<TimeItem>>>([])
    const [initialData, setInitialData] = useState<Array<Array<TimeItem>>>([])
    const [Success, setSuccess] = useSnackBar();
    const [Error, setError] = useSnackBar();
    const {setAppBar, backendService} = props;

    const simpleDayLabels = ["Werktage", "Wochenende"]
    const dayLabels = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"]

    useEffect(() => {
        backendService.getThermostats()
            .then((data) => {
                if (data?.length === 7) {
                    data = data.map(day => sortDay(day));
                    setData(data);
                    setInitialData(data);
                } else {
                    setData(data_);
                    setInitialData(data_);
                }
            }, (e) => {
                console.log(e);
                setData(data_)
                setInitialData(data_)
                setError(e)
            })
            .catch(console.log)
    }, [backendService, setError])

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

    const reset = useCallback(() => setData(initialData), [initialData]);
    const save = useCallback(() => {
        backendService.putThermostats(data)
            .then(() => setSuccess(t('changes_saved')), setError)
            .catch(console.log)
    }, [data, backendService, setSuccess, t, setError])

    useEffect(() => {
        setAppBar({
            title: t('card_thermostats_title'),
            showBackButton: false,
            children: () => <>
                <ResponsiveIconButton description={t('info')} icon={<InfoOutlined/>} onClick={openInfo}/>
                <ResponsiveIconButton description={t('reset')} icon={<RotateLeft/>} onClick={reset}/>
                <ResponsiveIconButton description={t('compare')} icon={<CompareArrowsOutlined/>}/>
                <ResponsiveIconButton description={t('save')} icon={<SaveAlt/>} onClick={save}/>
            </>
        })
    }, [t, openInfo, reset, setAppBar, save]);

    const [addTimeOpen, setAddTimeOpen] = useState(false);
    const [editTimeOpen, setEditTimeOpen] = useState(false);
    const [copyFromOpen, setCopyFromOpen] = useState(false);

    const onAddTime = useCallback((id: string) => {
        setShowTimePicker(true);
        setTemperature("21");
        setTime(createTime(12, 0));
        setID(+id);
        setAddTimeOpen(true);
    }, []);

    const onCopyFrom = useCallback((id: string) => setCopyFromOpen(true), []);
    const onDelete = useCallback((id: string, index: number) => {
        setData(prevState => prevState.map((item, idx) =>
            String(idx) === id ? item.filter((value, refIndex) => refIndex !== index) : item));
    }, [])
    const [id, setID] = useState<number>();
    const [index, setIndex] = useState<number>();
    const [time, setTime] = useState<Date | null>(new Date());
    const [temperature, setTemperature] = useState<string | null>("21");
    const [showTimePicker, setShowTimePicker] = useState(false);

    const addEntry = useCallback(() => {
        if (id === undefined || time === null || time === undefined || temperature === undefined || temperature === null) {
            console.log("id, time or temperature undefined, aborting");
            return;
        }

        setData(prevState => {
            const state = copyData(prevState);
            state[id].push({time: time, temperature: +temperature})
            sortDay(state[id])
            return state;
        });
        setAddTimeOpen(false);
    }, [id, time, temperature]);

    const editEntry = useCallback(() => {
        if (index === undefined || id === undefined || time === null || time === undefined || temperature === undefined || temperature === null) {
            console.log("id, time or temperature undefined, aborting");
            return;
        }

        setData(prevState => {
            const state = copyData(prevState);
            state[id][index] = {time: time, temperature: +temperature};
            sortDay(state[id])
            return state;
        });
        setEditTimeOpen(false);
    }, [index, id, time, temperature]);

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
                                                setID(+id);
                                                setIndex(index);
                                                setTime(day.data[index].time);
                                                setTemperature(String(day.data[index].temperature));
                                                setShowTimePicker(index > 0);
                                                setEditTimeOpen(true);
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
            <ModifyTimeItemDialog
                title="Add Entry"
                onOK={addEntry}
                onClose={() => setAddTimeOpen(false)}
                open={addTimeOpen}
                showTimePicker={true}
                setTemperature={setTemperature}
                temperature={temperature}
                setTime={setTime}
                time={time}
            />
            <ModifyTimeItemDialog
                title="Edit Entry"
                onOK={editEntry}
                onClose={() => setEditTimeOpen(false)}
                open={editTimeOpen}
                showTimePicker={showTimePicker}
                setTemperature={setTemperature}
                temperature={temperature}
                setTime={setTime}
                time={time}
            />
            <Dialog open={copyFromOpen} onClose={() => setCopyFromOpen(false)}>
                <DialogTitle>Copy From</DialogTitle>
            </Dialog>
            <InfoDialog title={t('info')} content={<Lorem/>} {...infoProps} />
            <AlertSnackbar {...Error}/>
            <AlertSnackbar severity="success" {...Success}/>
        </Track>
    )
}

export default Thermostats;