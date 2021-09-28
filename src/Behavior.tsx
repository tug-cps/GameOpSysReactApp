import InfoOutlined from "@mui/icons-material/InfoOutlined";
import SaveAlt from "@mui/icons-material/SaveAlt";
import {
    Avatar,
    Box,
    Container,
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
import BehaviorDragSelect, {Row} from "./behavior/BehaviorDragSelect"
import {AlertSnackbar} from "./common/AlertSnackbar";
import {backgroundColor, iconLookup, translate} from "./common/ConsumerTools";
import {InfoDialog, Lorem, useInfoDialog} from "./common/InfoDialog";
import {ResponsiveIconButton} from "./common/ResponsiveIconButton";
import useDefaultTracking from "./common/Tracking";
import {useSnackBar} from "./common/UseSnackBar";

const formatTime = (v: number) => v < 10 ? '0' + v : '' + v
const hours = Array.from(Array(24).keys()).map(v => formatTime(v));
const colors = ['lightgreen', 'yellow', 'red']
const energyAvailable = [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0].map(v => colors[v])

const date = new Date().toISOString().slice(0, 10)

const style = {
    userSelect: "none",
    borderCollapse: "collapse",
    "& thead th": {
        position: "sticky",
        top: "0px",
        zIndex: 1,
    },
    "& thead>tr:nth-child(2) th": {
        top: "37px"
    },
    "& td": {
        border: 1,
        borderColor: 'divider'
    },
    "& td.cell-selected": {
        backgroundColor: 'secondary.main'
    },
    "& td.cell-being-selected": {
        backgroundColor: 'primary.main'
    },
    "& td.cell-disabled": {
        backgroundColor: "red"
    }
} as const

interface Props extends PrivateRouteProps {
}

interface ExtendedRow extends Row {
    consumerId: string
}

interface State {
    rows: ExtendedRow[],
    modified: boolean,
}

function Behavior(props: Props) {
    const {Track} = useDefaultTracking({page: 'Behavior'});
    const [state, setState] = useState<State>({rows: [], modified: false});
    const [error, setError] = useSnackBar();
    const [success, setSuccess] = useSnackBar();
    const {t} = useTranslation();
    const [infoProps, openInfo] = useInfoDialog();
    const {setAppBar, backendService} = props;
    const {rows, modified} = state;

    useEffect(() => {
        Promise.all([backendService.getConsumers(), backendService.getPrediction(date)])
            .then(([consumers, predictions]) => {
                const cellStates = consumers
                    .filter((c) => c.active)
                    .map((c) => ({
                        header: (
                            <Tooltip title={translate(c.name, c.customName)} enterTouchDelay={0}>
                                <Avatar
                                    variant="rounded"
                                    style={{backgroundColor: backgroundColor(c.consumerId)}}
                                    sx={{width: 30, height: 30}}
                                >
                                    {iconLookup(c.type)}
                                </Avatar>
                            </Tooltip>
                        ),
                        consumerId: c.consumerId,
                        cellStates: predictions.find((p) => p.consumerId === c.consumerId)?.data ?? hours.map(() => false)
                    }));
                setState({rows: cellStates, modified: false})
            }, setError)
            .catch(console.log)
    }, [backendService, setError]);

    const handleChange = (cells: boolean[][]) => {
        setState({
            ...state,
            rows: state.rows.map((row, i) => ({...row, cellStates: cells[i]})),
            modified: true
        })
    };

    const handleSave = useCallback(() =>
            backendService.putPrediction(date, rows.map((r) => (
                {consumerId: r.consumerId, data: r.cellStates})))
                .then(() => setSuccess(t('changes_saved')))
                .then(() => setState({...state, modified: false}), setError)
                .catch(console.log)
        , [state, rows, backendService, setError, setSuccess, t]);

    useEffect(() => {
        setAppBar({
            title: t('card_behavior_title'),
            showBackButton: false,
            children: () => <>
                <ResponsiveIconButton description={t('info')} icon={<InfoOutlined/>} onClick={openInfo}/>
                <ResponsiveIconButton requiresAttention={state.modified}
                                      description={t('save')}
                                      icon={<SaveAlt/>}
                                      onClick={handleSave}/>
            </>
        })
    }, [t, setAppBar, handleSave, openInfo, state])

    return (
        <Track>
            <Container maxWidth="xl" disableGutters>
                <Box style={{display: "grid"}}>
                    <TableContainer
                        sx={{overflow: 'auto', maxHeight: {xs: 'calc(100vh - 120px)', sm: 'calc(100vh - 70px)'}}}>
                        <Table stickyHeader size="small" sx={style}>
                            <TableHead>
                                <TableRow>
                                    <TableCell variant="head"/>
                                    {hours.map((value) => <TableCell align="center">{String(value)}⁰⁰</TableCell>)}
                                </TableRow>
                                <TableRow>
                                    <TableCell/>
                                    {energyAvailable.map((v) => <TableCell style={{backgroundColor: v}}/>)}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <BehaviorDragSelect rows={rows} onChange={handleChange}/>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Container>
            <Prompt when={modified} message={t('unsaved_changes')}/>
            <InfoDialog title={t('info')} content={<Lorem/>} {...infoProps}/>
            <AlertSnackbar {...success} severity="success"/>
            <AlertSnackbar {...error} />
        </Track>)
}

export default Behavior;