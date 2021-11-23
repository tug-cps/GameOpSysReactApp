import {BarChartOutlined, CheckCircleOutlined} from "@mui/icons-material";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import {
    Avatar,
    CircularProgress,
    Container,
    DialogContentText,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
} from "@mui/material";
import {isPast, isValid} from "date-fns";
import React, {useCallback, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Prompt, Redirect, useLocation} from 'react-router-dom';
import {PrivateRouteProps} from "./App";
import BehaviorDragSelect, {CellState, Row} from "./behavior/BehaviorDragSelect"
import {AlertSnackbar} from "./common/AlertSnackbar";
import colorGradient from "./common/ColorGradient";
import {consumerLookup} from "./common/ConsumerTools";
import {useParsedDate} from "./common/Date";
import {InfoDialog, useInfoDialog} from "./common/InfoDialog";
import ResponsiveIconButton from "./common/ResponsiveIconButton";
import RetryMessage from "./common/RetryMessage";
import useDefaultTracking from "./common/Tracking";
import {useSnackBar} from "./common/UseSnackBar";

const formatTime = (v: number) => v < 10 ? '0' + v : '' + v
const hours = Array.from(Array(24).keys()).map(v => formatTime(v));

interface Props extends PrivateRouteProps {
}

interface ExtendedRow extends Row {
    consumerId: string
}

const ConsumerHeader = (props: { type: string }) => {
    const {t} = useTranslation();
    const {color, icon, tKey} = consumerLookup(props.type);
    return (
        <Tooltip title={<>{t(tKey)}</>} enterTouchDelay={0}>
            <Avatar variant="rounded" sx={{backgroundColor: color, width: 30, height: 30}} children={icon}/>
        </Tooltip>
    )
}

function PastBehavior(props: Props) {
    const {Track} = useDefaultTracking({page: 'PastBehavior'});
    const [rows, setRows] = useState<ExtendedRow[]>();
    const [availableEnergy, setAvailableEnergy] = useState<string[]>();
    const [modified, setModified] = useState(false);
    const [progress, setProgress] = useState(true);
    const [openFeedback, setOpenFeedback] = useState(false);
    const [validated, setValidated] = useState<boolean>();
    const [error, setError] = useSnackBar();
    const [success, setSuccess] = useSnackBar();
    const {t} = useTranslation();
    const [infoProps, openInfo] = useInfoDialog();
    const query = new URLSearchParams(useLocation().search);
    const date = query.get("date")!;
    const dateParsed = useParsedDate(date);
    const validDate = isValid(dateParsed) && isPast(dateParsed);
    const failed = !progress && !rows;

    const {setAppBar, backendService} = props;

    const initialLoad = useCallback(() => {
        if (!validDate) return;
        setProgress(true);
        Promise.all([
            backendService.getConsumers(),
            backendService.getPrediction(date),
            backendService.getAvailableEnergy(date)
        ]).then(([consumers, predictions, energy]) => {
            const cellStates = consumers
                .filter((c) => c.active)
                .map((c) => {
                    const consumerType = consumerLookup(c.type);
                    return ({
                        header: <ConsumerHeader type={c.type}/>,
                        consumerId: c.id,
                        cellStates: predictions.data.find((p) => p.consumerId === c.id)?.data ?? hours.map(() => 0),
                        colorSelected: consumerType.color,
                        colorBeingSelected: consumerType.colorAlt
                    });
                });
            setValidated(predictions.validated);
            setAvailableEnergy(energy?.map(colorGradient) ?? []);
            setRows(cellStates);
            setModified(false);
        }, (e) => {
            setError(e);
            setRows(undefined);
        })
            .catch(console.log)
            .finally(() => setProgress(false));
    }, [validDate, backendService, setError, date]);

    useEffect(initialLoad, [initialLoad]);

    const handleChange = useCallback((cells: CellState[][]) => {
        setRows(prevState => prevState?.map((row, i) => ({...row, cellStates: cells[i]})))
        setModified(true);
    }, []);

    const handleSave = useCallback(() => {
        if (!rows || validated) return;
        backendService.putPrediction(date, rows.map((r) => ({consumerId: r.consumerId, data: r.cellStates})))
            .then(() => {
                setSuccess(t('changes_saved'));
                setModified(false);
                setOpenFeedback(true);
            }, setError)
            .catch(console.log);
    }, [backendService, date, rows, setError, setSuccess, t, validated]);

    useEffect(() => {
        validDate && setAppBar({
            title: t('card_behavior_full_title', {date: dateParsed}),
            children: () => <>
                <ResponsiveIconButton description={t('info')} icon={<InfoOutlined/>} onClick={openInfo}/>
                {validated === undefined &&
                <ResponsiveIconButton description={t('loading')}
                                      icon={<CircularProgress variant="indeterminate" size="small" color="inherit"/>}/>
                }
                {validated !== undefined && !validated &&
                <ResponsiveIconButton requiresAttention={modified}
                                      description={t('save')}
                                      icon={<CheckCircleOutlined/>}
                                      onClick={handleSave}/>
                }
                {validated &&
                <ResponsiveIconButton description={t('feedback')}
                                      icon={<BarChartOutlined/>}
                                      onClick={() => setOpenFeedback(true)}/>
                }
            </>
        })
    }, [validDate, dateParsed, handleSave, modified, openInfo, setAppBar, t, validated])

    if (!validDate) return <Redirect to='/'/>
    if (openFeedback) return <Redirect to={'/feedback?date=' + date}/>

    const InfoContent = () => {
        const infoText = t('info_past_behavior', {returnObjects: true}) as string[]
        const infoConsumers = t('consumer_help', {returnObjects: true}) as string[]
        const infoText2 = t('consumer_help', {returnObjects: true}) as string[]
        return <>
            {infoText.map(text => <DialogContentText paragraph children={text}/>)}
            {infoConsumers.map(text => <DialogContentText children={text}/>)}
            {infoText2.map(text => <DialogContentText paragraph children={text}/>)}
        </>
    }

    return (
        <Track>
            {progress && <LinearProgress/>}
            {failed && <RetryMessage retry={initialLoad}/>}
            {rows &&
            <Container disableGutters maxWidth="xl" sx={{paddingTop: 1, display: "grid"}}>
                <TableContainer
                    sx={{overflow: 'auto', maxHeight: {xs: 'calc(100vh - 124px)', sm: 'calc(100vh - 72px)'}}}>
                    <Table stickyHeader size="small" sx={{userSelect: "none", borderCollapse: "collapse"}}>
                        <TableHead>
                            <TableRow>
                                <TableCell variant="head" sx={{border: 0}}/>
                                {hours.map((value) =>
                                    <TableCell align="center" sx={{border: 0}}>{String(value)}⁰⁰</TableCell>)}
                            </TableRow>
                            {availableEnergy &&
                            <TableRow>
                                <TableCell variant="head" sx={{border: 0}}/>
                                {availableEnergy.map((v) =>
                                    <TableCell sx={{border: 0, backgroundColor: v, top: "37px"}}/>)}
                            </TableRow>
                            }
                        </TableHead>
                        <TableBody>
                            <BehaviorDragSelect rows={rows} onChange={handleChange} readonly={validated}/>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
            }
            <Prompt when={modified} message={t('unsaved_changes')}/>
            <InfoDialog title={t('info')} content={<InfoContent/>} {...infoProps}/>
            <AlertSnackbar {...success} severity="success"/>
            <AlertSnackbar {...error} />
        </Track>)
}

export default PastBehavior;