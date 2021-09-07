import React, {useEffect, useState} from "react";
import BehaviorDragSelect, {Row} from "./behavior/BehaviorDragSelect"
import {
    Avatar,
    Box,
    Container,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    WithStyles
} from "@material-ui/core";
import DefaultAppBar from "./common/DefaultAppBar";
import {useTranslation} from "react-i18next";
import {Link as RouterLink, Prompt} from 'react-router-dom';
import AcUnitIcon from "@material-ui/icons/AcUnit";
import BackendService from "./service/BackendService";
import {withStyles} from "@material-ui/core/styles";
import {styles} from "./behavior/BehaviorStyles";
import {SaveAlt} from "@material-ui/icons";
import {iconLookup, translate} from "./common/ConsumerTools";
import {AlertSnackbar} from "./common/AlertSnackbar";
import {useSnackBar} from "./common/UseSnackBar";

const formatTime = (v: number) => {
    if (v < 10) {
        return '0' + v;
    }
    return '' + v;
}
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
    const [state, setState] = useState<State>({rows: [], modified: false});
    const [error, setError] = useSnackBar();
    const [success, setSuccess] = useSnackBar();
    const {backendService} = props;
    const {t} = useTranslation();
    const {classes} = props;

    useEffect(() => {
        Promise.all([backendService.getConsumers(), backendService.getPrediction(date)])
            .then(([consumers, predictions]) => {
                const cellStates = consumers
                    .filter((c) => c.active)
                    .map((c) => ({
                        header: (
                            <Tooltip title={translate(c.name, c.customName)} enterTouchDelay={0}>
                                <Avatar variant="rounded" className={classes.avatar}>{iconLookup(c.type)}</Avatar>
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
        <React.Fragment>
            <Prompt when={modified} message={t('unsaved_changes')}/>
            <DefaultAppBar hideBackButton title={t('card_behavior_title')}>
                <IconButton color="inherit" component={RouterLink}
                            to={"/thermostats"}><AcUnitIcon/></IconButton>
                <IconButton color="inherit" onClick={handleSave}><SaveAlt/></IconButton>
            </DefaultAppBar>
            <Container maxWidth="xl" disableGutters>
                <Box p={1}>
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
                </Box>
            </Container>
            <AlertSnackbar {...success} severity="success"/>
            <AlertSnackbar {...error} />
        </React.Fragment>)
}

export default withStyles(styles)(Behavior);