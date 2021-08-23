import React from "react";
import BehaviorDragSelect, {Row} from "./BehaviorDragSelect"
import {
    Box,
    Container,
    createStyles,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Theme,
    WithStyles
} from "@material-ui/core";
import DefaultAppBar from "./common/DefaultAppBar";
import {WithTranslation, withTranslation} from "react-i18next";
import {Link as RouterLink} from 'react-router-dom';
import AcUnitIcon from "@material-ui/icons/AcUnit";
import SaveIcon from "@material-ui/icons/Save";
import BackendService from "./service/BackendService";
import {withStyles} from "@material-ui/core/styles";

const formatTime = (v: number) => {
    if (v < 10) {
        return '0' + v;
    }
    return '' + v;
}
const hours = Array.from(Array(24).keys()).map(v => formatTime(v));
const colors = ['lightgreen', 'yellow', 'red']
const energyAvailable = [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0].map(v => colors[v])

const styles = ({palette}: Theme) => createStyles({
    container: {
        overflow: 'auto',
        maxHeight: 'calc(100vh - 140px)'
    },
    tableDragSelect: {
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
            border: "1px solid " + palette.divider
        },
        "& td.cell-selected": {
            backgroundColor: palette.secondary.main
        },
        "& td.cell-being-selected": {
            backgroundColor: palette.primary.main
        },
        "& td.cell-disabled": {
            backgroundColor: "red"
        }
    }
});

interface Props extends WithTranslation, WithStyles<typeof styles> {
    backendService: BackendService
}

interface State {
    rows: Row[]
}

class Behavior extends React.Component<Props, State> {
    constructor(props: Readonly<Props> | Props) {
        super(props);

        this.state = {
            rows: [],
        };
    }

    componentDidMount() {
        this.props.backendService.getConsumers()
            .then((v) => {
                this.setState({rows: v.map((c) => ({header: c.name, cellStates: hours.map(() => false)}))})
            })
            .catch(console.log)
    }

    handleChange = (cells: boolean[][]) => {
        this.setState({
            rows: this.state.rows.map((row, i) => {
                return {header: row.header, cellStates: cells[i]}
            })
        })
    };

    render() {
        const {t, classes} = this.props;
        const {rows} = this.state;
        return (
            <React.Fragment>
                <DefaultAppBar hideBackButton title={t('card_behavior_title')}>
                    <IconButton color="inherit" component={RouterLink}
                                to={"/thermostats"}><AcUnitIcon/></IconButton>
                    <IconButton color="inherit"><SaveIcon/></IconButton>
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