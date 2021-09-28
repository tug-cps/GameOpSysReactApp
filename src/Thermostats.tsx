import CompareArrowsOutlined from "@mui/icons-material/CompareArrowsOutlined"
import InfoOutlined from "@mui/icons-material/InfoOutlined"
import RotateLeft from "@mui/icons-material/RotateLeft"
import SaveAlt from "@mui/icons-material/SaveAlt"
import Container from "@mui/material/Container"
import DialogContent from "@mui/material/DialogContent"
import Divider from "@mui/material/Divider";
import Grid, {GridSize} from "@mui/material/Grid"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Stack from "@mui/material/Stack"
import Switch from "@mui/material/Switch"
import Typography from "@mui/material/Typography"
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {PrivateRouteProps} from "./App";
import {AlertSnackbar} from "./common/AlertSnackbar";
import {InfoDialog, Lorem, useInfoDialog} from "./common/InfoDialog";
import {ResponsiveDialog} from "./common/ResponsiveDialog";
import {ResponsiveIconButton} from "./common/ResponsiveIconButton";
import {createTime} from "./common/Time";
import useDefaultTracking from "./common/Tracking";
import {useSnackBar} from "./common/UseSnackBar";
import {ThermostatModel, TimeItem} from "./service/Model";
import {data_} from "./thermostats/DummyData";
import {ModifyTimeItemDialog} from "./thermostats/ModifyTimeItemDialog";
import {ThermostatDaySetting} from "./thermostats/ThermostatDaySetting";

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

const copySetting = (data: Array<Array<TimeItem>>) => data.map((day) => day.map((e) => ({...e})))
const copyData = (data: ThermostatModel): ThermostatModel => ({
    ...data,
    simple: copySetting(data.simple),
    advanced: copySetting(data.advanced)
})
const sortDay = (day: Array<TimeItem>) => day.sort((a, b) => a.time.getHours() > b.time.getHours() || (a.time.getHours() === b.time.getHours() && a.time.getMinutes() >= b.time.getMinutes()) ? 1 : -1)

function Thermostats(props: Props) {
    const {Track} = useDefaultTracking({page: 'Power'});
    const {t} = useTranslation();
    const [infoProps, openInfo] = useInfoDialog();
    const [data, setData] = useState<ThermostatModel>(data_)
    const [initialData, setInitialData] = useState<ThermostatModel>(data_)
    const [Success, setSuccess] = useSnackBar();
    const [Error, setError] = useSnackBar();
    const {setAppBar, backendService} = props;

    const simpleDayLabels = [t('day_weekdays'), t('day_weekend')]
    const dayLabels = [t('day_monday'), t('day_tuesday'), t('day_wednesday'), t('day_thursday'), t('day_friday'), t('day_saturday'), t('day_sunday')]

    useEffect(() => {
        backendService.getThermostats()
            .then((data) => {
                if (!data) return;
                data.simple = data.simple.map(day => sortDay(day));
                data.advanced = data.advanced.map(day => sortDay(day));
                setData(data);
                setInitialData(data);
            }, setError)
            .catch(console.log)
    }, [backendService, setError])

    const reset = useCallback(() => setData(initialData), [initialData]);
    const save = useCallback(() => {
        backendService.putThermostats(data)
            .then(() => setSuccess(t('changes_saved')), setError)
            .then(() => setInitialData(data))
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
    const onCopyFrom = useCallback((id: string) => {
        setID(+id);
        setCopyFromOpen(true);
    }, []);
    const onDelete = useCallback((id: string, index: number) => {
        setData(prevState => {
            const intId = +id;
            const state = copyData(prevState)
            if (intId > 9) {
                state.simple[intId - 10].splice(index, 1)
            } else {
                state.advanced[intId].splice(index, 1)
            }
            return state;
        });
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
            if (id > 9) {
                state.simple[id - 10].push({time: time, temperature: +temperature})
                sortDay(state.simple[id - 10])
            } else {
                state.advanced[id].push({time: time, temperature: +temperature})
                sortDay(state.advanced[id])
            }
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
            if (id > 9) {
                state.simple[id - 10][index] = {time: time, temperature: +temperature};
                sortDay(state.simple[id - 10])
            } else {
                state.advanced[id][index] = {time: time, temperature: +temperature};
                sortDay(state.advanced[id])
            }
            return state;
        });
        setEditTimeOpen(false);
    }, [index, id, time, temperature]);

    const copyFrom = useCallback((fromID: number) => {
        if (id === undefined) return;
        setData(prevState => {
            const state = copyData(prevState);
            const from = (fromID > 9 ? prevState.simple[fromID - 10] : prevState.advanced[fromID]).map(it => ({...it}));
            if (id > 9) {
                state.simple[id - 10] = from;
            } else {
                state.advanced[id] = from;
            }
            return state;
        });
    }, [id])

    if (!data) return <></>

    const empty = [{time: createTime(0, 0), temperature: 21}]
    const days = dayLabels.map((value, index) => ({
        id: String(index),
        label: value,
        data: data.advanced.length < index ? empty : data.advanced[index]
    }))
    const simpleDays = simpleDayLabels.map((value, index) => ({
        id: String(index + 10),
        label: value,
        data: data.simple[index]
    }))
    const tabs: TabModel[] = [
        {days: simpleDays, md: 6, lg: 6, xl: 6},
        {days: days, md: 6, lg: 4, xl: 4}
    ]

    return (
        <Track>
            <Container maxWidth="xl">
                <Stack direction="row" spacing={1} sx={{alignItems: "center", justifyContent: "end", pb: 1}}>
                    <Typography variant="subtitle1">Benutze erweiterte Einstellungen</Typography>
                    <Switch
                        checked={data.useAdvanced}
                        onChange={(event, value) => setData(prevState => ({...prevState, useAdvanced: value}))}/>
                </Stack>

                {tabs.map((tab, index) => (
                    <TabPanel index={index} value={data.useAdvanced ? 1 : 0} key={index}>
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
            <ResponsiveDialog title={t('dialog_copy_from_title')} open={copyFromOpen}
                              onClose={() => setCopyFromOpen(false)}>
                <DialogContent>
                    <List>
                        {dayLabels.map((day, index) =>
                            <ListItem
                                key={index}
                                button
                                disabled={index === id}
                                onClick={() => {
                                    copyFrom(index);
                                    setCopyFromOpen(false);
                                }}
                            ><ListItemText>{day}</ListItemText></ListItem>)}
                        <Divider variant="middle"/>
                        {simpleDayLabels.map((day, index) =>
                            <ListItem
                                key={index + 10}
                                button
                                disabled={index + 10 === id}
                                onClick={() => {
                                    copyFrom(index + 10);
                                    setCopyFromOpen(false);
                                }}
                            ><ListItemText>{day}</ListItemText></ListItem>)}
                    </List>
                </DialogContent>
            </ResponsiveDialog>
            <InfoDialog title={t('info')} content={<Lorem/>} {...infoProps} />
            <AlertSnackbar {...Error}/>
            <AlertSnackbar severity="success" {...Success}/>
        </Track>
    )
}

export default Thermostats;