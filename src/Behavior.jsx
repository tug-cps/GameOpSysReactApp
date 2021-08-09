import React from "react";
import TableDragSelect from "react-table-drag-select";
import {Box, Container, Icon, IconButton, TableCell, TableContainer} from "@material-ui/core";
import DefaultAppBar from "./common/DefaultAppBar";
import {withTranslation} from "react-i18next";
import {Link as RouterLink} from 'react-router-dom';

const formatTime = (v) => {
    if (v < 10) {
        return '0' + v;
    }
    return '' + v;
}
const consumers = ['Kochen', 'Medien', 'Wäsche', 'Geschirrspülmaschine', 'Eigenes Gerät A', 'Eigenes Gerät B']
const hours = Array.from(Array(24).keys()).map(v => formatTime(v) + "-" + formatTime(v + 1));
const colors = ['lightgreen', 'yellow', 'red']
const energyAvailable = [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0].map(v => colors[v])

class Behavior extends React.Component<> {

    state = {
        cells: [
            [false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false]
        ]
    };


    render() {
        const {t} = this.props;
        return (
            <div>
                <DefaultAppBar hideBackButton title={t('card_behavior_title')}>
                    <IconButton color="inherit" component={RouterLink} to={"/thermostats"}>
                        <Icon>ac_unit</Icon>
                    </IconButton>
                </DefaultAppBar>
                <Container>
                    <Box component="div" overflow="visible">
                        <TableContainer>
                            <TableDragSelect value={this.state.cells} onChange={this.handleChange}>
                                <tr>
                                    <td disabled/>
                                    {hours.map((value) => <TableCell disabled>{String(value)}</TableCell>)}
                                </tr>
                                <tr>
                                    <td disabled/>
                                    {energyAvailable.map((v) =>
                                        <TableCell style={{backgroundColor: v}} disabled/>)}
                                </tr>
                                {/* Content */}
                                {consumers.map((value) =>
                                    <tr>
                                        <td disabled>{String(value)}</td>
                                        {hours.map(() => <td/>)}
                                    </tr>
                                )}
                            </TableDragSelect>
                        </TableContainer>

                    </Box>
                </Container>
            </div>)
    };

    handleChange = cells => this.setState({cells});
}

export default withTranslation()(Behavior);