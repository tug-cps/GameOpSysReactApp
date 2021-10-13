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
import {isPast, isValid} from "date-fns";
import React, {useCallback, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Prompt, Redirect, useLocation} from 'react-router-dom';
import {PrivateRouteProps} from "./App";
import BehaviorDragSelect, {CellState, Row} from "./behavior/BehaviorDragSelect"
import {AlertSnackbar} from "./common/AlertSnackbar";
import {consumerLookup, translate} from "./common/ConsumerTools";
import {useParsedDate} from "./common/Date";
import {InfoDialog, Lorem, useInfoDialog} from "./common/InfoDialog";
import {ResponsiveIconButton} from "./common/ResponsiveIconButton";
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
    const {Track} = useDefaultTracking({page: 'Behavior'});
    const [rows, setRows] = useState<ExtendedRow[]>();
    const [modified, setModified] = useState(false);
    const [error, setError] = useSnackBar();
    const [success, setSuccess] = useSnackBar();
    const {t} = useTranslation();
    const [infoProps, openInfo] = useInfoDialog();
    const query = new URLSearchParams(useLocation().search);
    const date = query.get("date")!;
    const dateParsed = useParsedDate(date);
    const validDate = isValid(dateParsed) && isPast(dateParsed);

    const {setAppBar, backendService} = props;

    useEffect(() => {
        if (!validDate) return;
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
    }, [validDate, backendService, setError, date]);

    const handleChange = useCallback((cells: CellState[][]) => {
        setRows(prevState => prevState?.map((row, i) => ({...row, cellStates: cells[i]})))
        setModified(true);
    }, []);

    const handleSave = useCallback(() => {
        rows && backendService.putPrediction(date, rows.map((r) => ({consumerId: r.consumerId, data: r.cellStates})))
            .then(() => {
                setSuccess(t('changes_saved'));
                setModified(false);
            }, setError)
            .catch(console.log)
    }, [backendService, date, rows, setError, setSuccess, t]);

    useEffect(() => {
        validDate && setAppBar({
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
    }, [validDate, dateParsed, handleSave, modified, openInfo, setAppBar, t])

    if (!validDate) return <Redirect to={'/'}/>
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