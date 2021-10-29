import {CheckCircleOutlined} from "@mui/icons-material";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import {
    Avatar,
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
import React, {useCallback, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Prompt} from 'react-router-dom';
import {PrivateRouteProps} from "./App";
import BehaviorDragSelect, {CellState, Row} from "./behavior/BehaviorDragSelect"
import {AlertSnackbar} from "./common/AlertSnackbar";
import colorGradient from "./common/ColorGradient";
import {consumerLookup} from "./common/ConsumerTools";
import handle404 from "./common/Handle404";
import {InfoDialog, useInfoDialog} from "./common/InfoDialog";
import ResponsiveIconButton from "./common/ResponsiveIconButton";
import RetryMessage from "./common/RetryMessage";
import useDefaultTracking from "./common/Tracking";
import {useSnackBar} from "./common/UseSnackBar";

const formatTime = (v: number) => v < 10 ? '0' + v : '' + v
const hours = Array.from(Array(24).keys()).map(v => formatTime(v));

const today = new Date();
const date = new Date();
date.setDate(today.getDate() + 1)
const isoDate = date.toISOString().slice(0, 10)

interface Props extends PrivateRouteProps {
}

interface ExtendedRow extends Row {
    consumerId: string
}

function Behavior(props: Props) {
    const {Track} = useDefaultTracking({page: 'Behavior'});
    const [rows, setRows] = useState<ExtendedRow[]>();
    const [availableEnergy, setAvailableEnergy] = useState<string[]>();
    const [progress, setProgress] = useState(true);
    const [modified, setModified] = useState(false);
    const [error, setError] = useSnackBar();
    const [success, setSuccess] = useSnackBar();
    const {t} = useTranslation();
    const [infoProps, openInfo] = useInfoDialog();
    const {setAppBar, backendService} = props;
    const failed = !progress && !rows;

    const initialLoad = useCallback(() => {
        setProgress(true);
        Promise.all([
            backendService.getConsumers(),
            handle404(backendService.getPrediction(isoDate), () => ({validated: false, data: []})),
            backendService.getAvailableEnergy(isoDate)
        ]).then(([consumers, predictions, energy]) => {
            const cellStates = consumers
                .filter((c) => c.active)
                .map((c) => {
                    const {color, colorAlt, tKey, icon} = consumerLookup(c.type);
                    return {
                        header: (
                            <Tooltip title={<>{t(tKey)}</>} enterTouchDelay={0}>
                                <Avatar
                                    variant="rounded"
                                    sx={{width: 30, height: 30, backgroundColor: color}}
                                    children={icon}
                                />
                            </Tooltip>
                        ),
                        consumerId: c.id,
                        cellStates: predictions.data.find((p) => p.consumerId === c.id)?.data ?? hours.map(() => 0),
                        colorSelected: color,
                        colorBeingSelected: colorAlt
                    }
                });
            setAvailableEnergy(energy?.map(colorGradient) ?? [])
            setRows(cellStates);
            setModified(false);
        }, setError)
            .catch(console.log)
            .finally(() => setProgress(false));
    }, [t, backendService, setError]);

    useEffect(initialLoad, [initialLoad]);

    const handleChange = useCallback((cells: CellState[][]) => {
        setRows(prevState => prevState?.map((row, i) => ({...row, cellStates: cells[i]})))
        setModified(true);
    }, []);

    const handleSave = useCallback(() => {
        if (!rows) return;
        rows && backendService.putPrediction(isoDate, rows.map((r) => ({consumerId: r.consumerId, data: r.cellStates})))
            .then(() => {
                setSuccess(t('changes_saved'));
                setModified(false);
            }, setError)
            .catch(console.log)
    }, [rows, backendService, setError, setSuccess, t]);

    useEffect(() => {
        setAppBar({
            title: t('card_behavior_full_title', {date: date}),
            showBackButton: false,
            children: () => <>
                <ResponsiveIconButton description={t('info')} icon={<InfoOutlined/>} onClick={openInfo}/>
                <ResponsiveIconButton requiresAttention={modified}
                                      description={t('save')}
                                      icon={<CheckCircleOutlined/>}
                                      onClick={handleSave}/>
            </>
        })
    }, [t, setAppBar, handleSave, openInfo, modified])

    const InfoContent = () => {
        const infoText = t('info_behavior', {returnObjects: true}) as string[]
        const infoConsumers = t('consumer_help', {returnObjects: true}) as string[]
        return <>
            {infoText.map(text => <DialogContentText paragraph children={text}/>)}
            {infoConsumers.map(text => <DialogContentText children={text}/>)}
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
                                {hours.map((value) => <TableCell align="center">{String(value)}⁰⁰</TableCell>)}
                            </TableRow>
                            {availableEnergy &&
                            <TableRow>
                                <TableCell sx={{border: 0}}/>
                                {availableEnergy.map((v) => <TableCell
                                    sx={{border: 0, backgroundColor: v, top: "37px"}}/>)}
                            </TableRow>
                            }
                        </TableHead>
                        <TableBody>
                            <BehaviorDragSelect rows={rows} onChange={handleChange}/>
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

export default Behavior;