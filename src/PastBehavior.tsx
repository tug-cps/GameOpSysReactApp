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
import {isPast, isValid} from "date-fns";
import React, {useCallback, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Prompt, Redirect, useLocation} from 'react-router-dom';
import {PrivateRouteProps} from "./App";
import BehaviorDragSelect, {CellState, Row} from "./behavior/BehaviorDragSelect"
import {AlertSnackbar} from "./common/AlertSnackbar";
import {consumerLookup, translate} from "./common/ConsumerTools";
import {useParsedDate} from "./common/Date";
import {InfoDialog, useInfoDialog} from "./common/InfoDialog";
import ResponsiveIconButton from "./common/ResponsiveIconButton";
import RetryMessage from "./common/RetryMessage";
import useDefaultTracking from "./common/Tracking";
import {useSnackBar} from "./common/UseSnackBar";
import {ConsumerModel} from "./service/Model";

const formatTime = (v: number) => v < 10 ? '0' + v : '' + v
const hours = Array.from(Array(24).keys()).map(v => formatTime(v));
const colors = ['lightgreen', 'yellow', 'red']
const energyAvailable = [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0].map(v => colors[v])

interface Props extends PrivateRouteProps {
}

interface ExtendedRow extends Row {
    consumerId: string
}

interface HeaderProps {
    consumer: ConsumerModel
}

const compareConsumerProps = (a: HeaderProps, b: HeaderProps) => a.consumer.consumerId === b.consumer.consumerId
const ConsumerHeader = React.memo((props: { consumer: ConsumerModel }) => {
    const {consumer} = props;
    const consumerType = consumerLookup(consumer.type);
    return (<Tooltip title={translate(consumer.name, consumer.customName)} enterTouchDelay={0}>
        <Avatar
            variant="rounded"
            sx={{backgroundColor: consumerType.color, width: 30, height: 30}}
            children={consumerType.icon}
        />
    </Tooltip>)
}, compareConsumerProps);

function PastBehavior(props: Props) {
    const {Track} = useDefaultTracking({page: 'PastBehavior'});
    const [rows, setRows] = useState<ExtendedRow[]>();
    const [modified, setModified] = useState(false);
    const [progress, setProgress] = useState(true);
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
        Promise.all([backendService.getConsumers(), backendService.getPrediction(date)])
            .then(([consumers, predictions]) => {
                const cellStates = consumers
                    .filter((c) => c.active)
                    .map((c) => {
                        const consumerType = consumerLookup(c.type);
                        return ({
                            header: <ConsumerHeader consumer={c}/>,
                            consumerId: c.consumerId,
                            cellStates: predictions.find((p) => p.consumerId === c.consumerId)?.data ?? hours.map(() => 0),
                            colorSelected: consumerType.color,
                            colorBeingSelected: consumerType.colorAlt
                        });
                    });
                setRows(cellStates);
                setModified(false);
            }, setError)
            .catch(console.log)
            .finally(() => setProgress(false));
    }, [validDate, backendService, setError, date]);

    useEffect(initialLoad, [initialLoad]);

    const handleChange = useCallback((cells: CellState[][]) => {
        setRows(prevState => prevState?.map((row, i) => ({...row, cellStates: cells[i]})))
        setModified(true);
    }, []);

    const handleSave = useCallback(() => {
        if (!rows) return;
        backendService.putPrediction(date, rows.map((r) => ({consumerId: r.consumerId, data: r.cellStates})))
            .then(() => {
                setSuccess(t('changes_saved'));
                setModified(false);
            }, setError)
            .catch(console.log);
    }, [backendService, date, rows, setError, setSuccess, t]);

    useEffect(() => {
        validDate && setAppBar({
            title: t('card_behavior_full_title', {date: dateParsed}),
            showBackButton: true,
            children: () => <>
                <ResponsiveIconButton description={t('info')} icon={<InfoOutlined/>} onClick={openInfo}/>
                <ResponsiveIconButton requiresAttention={modified}
                                      description={t('save')}
                                      icon={<CheckCircleOutlined/>}
                                      onClick={handleSave}/>
            </>
        })
    }, [validDate, dateParsed, handleSave, modified, openInfo, setAppBar, t])

    if (!validDate) return <Redirect to='/'/>

    const InfoContent = () => {
        const infoText = t('info_past_behavior', {returnObjects: true}) as string[]
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
            }
            <Prompt when={modified} message={t('unsaved_changes')}/>
            <InfoDialog title={t('info')} content={<InfoContent/>} {...infoProps}/>
            <AlertSnackbar {...success} severity="success"/>
            <AlertSnackbar {...error} />
        </Track>)
}

export default PastBehavior;