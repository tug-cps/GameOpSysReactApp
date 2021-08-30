import React from "react";
import BehaviorDragSelect, {Row} from "./BehaviorDragSelect"
import {
    Box,
    Container,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    WithStyles
} from "@material-ui/core";
import DefaultAppBar from "./common/DefaultAppBar";
import {WithTranslation, withTranslation} from "react-i18next";
import {Link as RouterLink, Prompt} from 'react-router-dom';
import AcUnitIcon from "@material-ui/icons/AcUnit";
import BackendService from "./service/BackendService";
import {withStyles} from "@material-ui/core/styles";
import {styles} from "./BehaviorStyles";
import {SaveAlt} from "@material-ui/icons";
import {iconLookup, translate} from "./common/ConsumerTools";

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

interface Props extends WithTranslation, WithStyles<typeof styles> {
    backendService: BackendService
}

interface ExtendedRow extends Row {
    consumerId: string
}

interface State {
    rows: ExtendedRow[],
    modified: boolean
}

class Behavior extends React.Component<Props, State> {
    constructor(props: Readonly<Props> | Props) {
        super(props);

        this.state = {
            rows: [],
            modified: false
        };
    }

    componentDidMount() {

        const {backendService} = this.props;
        Promise.all([backendService.getConsumers(), backendService.getPrediction(date)])
            .then(([consumers, predictions]) => {
                const cellStates = consumers.map((c) => ({
                    header: iconLookup(c.type),
                    headerTooltip: translate(c.name, c.customName),
                    consumerId: c.consumerId,
                    cellStates: predictions.find((p) => p.consumerId === c.consumerId)?.data ?? hours.map(() => false)
                }));
                this.setState({rows: cellStates, modified: false})
            })
            .catch(console.log)
    }

    handleChange = (cells: boolean[][]) => {
        const {rows} = this.state;
        this.setState({
            rows: rows.map((row, i) => ({...row, cellStates: cells[i]})),
            modified: true
        })
    };

    handleSave = () => {
        const {backendService} = this.props;
        backendService.putPrediction(date, this.state.rows.map((r) => ({
            consumerId: r.consumerId,
            data: r.cellStates
        }))).then(() => {
            this.setState({modified: false})
        }).catch(console.log);
    }

    render() {
        const {t, classes} = this.props;
        const {rows, modified} = this.state;
        return (
            <React.Fragment>
                <Prompt when={modified} message={t('unsaved_changes')}/>
                <DefaultAppBar hideBackButton title={t('card_behavior_title')}>
                    <IconButton color="inherit" component={RouterLink}
                                to={"/thermostats"}><AcUnitIcon/></IconButton>
                    <IconButton color="inherit" onClick={this.handleSave}><SaveAlt/></IconButton>
                </DefaultAppBar>
                <Container maxWidth="xl" disableGutters>
                    <Box p={1}>
                        <TableContainer className={classes.container}>
                            <Table stickyHeader size="small" className={classes.tableDragSelect}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell variant="head"/>
                                        {hours.map((value) => <TableCell>{String(value)}</TableCell>)}
                                    </TableRow>
                                    <TableRow>
                                        <TableCell/>
                                        {energyAvailable.map((v) => <TableCell style={{backgroundColor: v}}/>)}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <BehaviorDragSelect rows={rows} onChange={this.handleChange}/>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Container>
            </React.Fragment>)
    };
}

export default withStyles(styles)(withTranslation()(Behavior));