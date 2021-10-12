import InfoOutlined from "@mui/icons-material/InfoOutlined";
import SaveAlt from "@mui/icons-material/SaveAlt";
import {
    Avatar,
    Container,
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
import {Prompt, useLocation} from 'react-router-dom';
import {PrivateRouteProps} from "./App";
import BehaviorDragSelect, {CellState, Row} from "./behavior/BehaviorDragSelect"
import {AlertSnackbar} from "./common/AlertSnackbar";
import {backgroundColor, iconLookup, translate} from "./common/ConsumerTools";
import {InfoDialog, Lorem, useInfoDialog} from "./common/InfoDialog";
import {ResponsiveIconButton} from "./common/ResponsiveIconButton";
import useDefaultTracking from "./common/Tracking";
import {useSnackBar} from "./common/UseSnackBar";
import {parse} from "date-fns";

const formatTime = (v: number) => v < 10 ? '0' + v : '' + v
const hours = Array.from(Array(24).keys()).map(v => formatTime(v));
const colors = ['lightgreen', 'yellow', 'red']
const energyAvailable = [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0].map(v => colors[v])

interface Props extends PrivateRouteProps {
}

interface ExtendedRow extends Row {
    consumerId: string
}

function PastBehavior(props: Props) {
    const {Track} = useDefaultTracking({page: 'Behavior'});
    const [rows, setRows] = useState<ExtendedRow[]>();
    const [modified, setModified] = useState(false);
    const [error, setError] = useSnackBar();
    const [success, setSuccess] = useSnackBar();
    const {t} = useTranslation();
    const [infoProps, openInfo] = useInfoDialog();
    const query = new URLSearchParams(useLocation().search);
    const date = query.get("date")!;
    const dateParsed = parse(date, 'yyyy-MM-dd', new Date());

    const {setAppBar, backendService} = props;

    useEffect(() => {
        if (!date) return;
        Promise.all([backendService.getConsumers(), backendService.getPrediction(date)])
            .then(([consumers, predictions]) => {
                const cellStates = consumers
                    .filter((c) => c.active)
                    .map((c) => ({
                        header: (
                            <Tooltip title={translate(c.name, c.customName)} enterTouchDelay={0}>
                                <Avatar
                                    variant="rounded"
                                    sx={{backgroundColor: backgroundColor(c.consumerId), width: 30, height: 30}}
                                >
                                    {iconLookup(c.type)}
                                </Avatar>
                            </Tooltip>
                        ),
                        consumerId: c.consumerId,
                        cellStates: predictions.find((p) => p.consumerId === c.consumerId)?.data ?? hours.map(() => 0)
                    }));
                setRows(cellStates);
                setModified(false);
            }, setError)
            .catch(console.log)
    }, [backendService, setError, date]);

    const handleChange = useCallback((cells: CellState[][]) => {
        setRows(prevState => prevState?.map((row, i) => ({...row, cellStates: cells[i]})))
        setModified(true);
    }, []);

    const handleSave = useCallback(() => {
        if (!date) return;
        rows && backendService.putPrediction(date, rows.map((r) => ({consumerId: r.consumerId, data: r.cellStates})))
            .then(() => {
                setSuccess(t('changes_saved'));
                setModified(false);
            }, setError)
            .catch(console.log)
    }, [date, rows, backendService, setError, setSuccess, t]);

    useEffect(() => {
        setAppBar({
            title: t('card_behavior_full_title', {date: dateParsed}),
            showBackButton: true,
            children: () => <>
                <ResponsiveIconButton description={t('info')} icon={<InfoOutlined/>} onClick={openInfo}/>
                <ResponsiveIconButton requiresAttention={modified}
                                      description={t('save')}
                                      icon={<SaveAlt/>}
                                      onClick={handleSave}/>
            </>
        })
    }, [t, setAppBar, handleSave, openInfo, modified, date, dateParsed])

    if (!rows) return <LinearProgress/>

    return (
        <Track>
            <Container disableGutters maxWidth="xl" sx={{paddingTop: 1, display: "grid"}}>
                <TableContainer
                    sx={{overflow: 'auto', maxHeight: {xs: 'calc(100vh - 124px)', sm: 'calc(100vh - 72px)'}}}>
                    <Table stickyHeader size="small" sx={{userSelect: "none", borderCollapse: "collapse"}}>
                        <TableHead>
                            <TableRow>
                                <TableCell variant="head"/>
                                {hours.map((value) => <TableCell align="center">{String(value)}⁰⁰</TableCell>)}
                            </TableRow>
                            <TableRow>
                                <TableCell/>
                                {energyAvailable.map((v) => <TableCell sx={{backgroundColor: v, top: "37px"}}/>)}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <BehaviorDragSelect rows={rows} onChange={handleChange}/>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
            <Prompt when={modified} message={t('unsaved_changes')}/>
            <InfoDialog title={t('info')} content={<Lorem/>} {...infoProps}/>
            <AlertSnackbar {...success} severity="success"/>
            <AlertSnackbar {...error} />
        </Track>)
}

export default PastBehavior;