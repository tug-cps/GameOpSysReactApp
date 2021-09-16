import React, {useEffect, useState} from "react";
import BehaviorDragSelect, {Row} from "./behavior/BehaviorDragSelect"
import {
    Avatar,
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    WithStyles
} from "@material-ui/core";
import DefaultAppBar, {Content, Root} from "./common/DefaultAppBar";
import {useTranslation} from "react-i18next";
import {Prompt} from 'react-router-dom';
import BackendService from "./service/BackendService";
import {withStyles} from "@material-ui/core/styles";
import {styles} from "./behavior/BehaviorStyles";
import {InfoOutlined, SaveAlt} from "@material-ui/icons";
import {backgroundColor, iconLookup, translate} from "./common/ConsumerTools";
import {AlertSnackbar} from "./common/AlertSnackbar";
import {useSnackBar} from "./common/UseSnackBar";
import useDefaultTracking from "./common/Tracking";
import {InfoDialog, Lorem, useInfoDialog} from "./common/InfoDialog";
import {ResponsiveIconButton} from "./common/ResponsiveIconButton";

const formatTime = (v: number) => v < 10 ? '0' + v : '' + v
const hours = Array.from(Array(24).keys()).map(v => formatTime(v));
const colors = ['lightgreen', 'yellow', 'red']
const energyAvailable = [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0].map(v => colors[v])

const date = new Date().toISOString().slice(0, 10)

interface Props extends WithStyles<typeof styles> {
    backendService: BackendService
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
    const {backendService} = props;
    const {t} = useTranslation();
    const [infoProps, openInfo] = useInfoDialog();
    const {classes} = props;

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
                                    className={classes.avatar}
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
    }, [backendService, classes.avatar, setError]);

    const handleChange = (cells: boolean[][]) => {
        setState({
            ...state,
            rows: state.rows.map((row, i) => ({...row, cellStates: cells[i]})),
            modified: true
        })
    };

    const handleSave = () =>
        backendService.putPrediction(
            date,
            state.rows.map((r) => ({
                consumerId: r.consumerId,
                data: r.cellStates
            })))
            .then(() => {
                setSuccess(t('behavior_changes_saved'));
            })
            .then(() => setState({...state, modified: false}), setError)
            .catch(console.log)

    const {rows, modified} = state;
    return (
        <Track>
            <Root>
                <DefaultAppBar hideBackButton title={t('card_behavior_title')}>
                    <ResponsiveIconButton description={t('info')} icon={<InfoOutlined/>} onClick={openInfo}/>
                    <ResponsiveIconButton description={t('save')} icon={<SaveAlt/>} onClick={handleSave}/>
                </DefaultAppBar>
                <Content>
                    <Container maxWidth="xl" disableGutters>
                        <TableContainer className={classes.container}>
                            <Table stickyHeader size="small" className={classes.tableDragSelect}>
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
                    </Container>
                </Content>
            </Root>
            <Prompt when={modified} message={t('unsaved_changes')}/>
            <InfoDialog title={t('info')} content={<Lorem/>} {...infoProps}/>
            <AlertSnackbar {...success} severity="success"/>
            <AlertSnackbar {...error} />
        </Track>)
}

export default withStyles(styles)(Behavior);