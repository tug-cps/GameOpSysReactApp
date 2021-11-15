/*  Adapted from https://github.com/mcjohnalds/react-table-drag-select */

import React from "react";
import {TableCell, TableRow} from "@mui/material";
import {Cell} from "./Cell";
import {eventToCellLocation, isValidEvent, minMax} from "./helpers";

export type CellState = 0 | 1 | 2 | 3 | 4;

export interface Row {
    header: JSX.Element
    cellStates: CellState[]
    colorSelected?: string
    colorBeingSelected?: string
}

interface Props {
    onChange: (value: CellState[][]) => void
    rows: Row[]
    readonly?: boolean
}

interface State {
    selectionStarted: boolean
    startRow: number
    startColumn: number
    endRow: number
    endColumn: number
    addMode: boolean
}

class BehaviorDragSelect extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            selectionStarted: false,
            startRow: 0,
            startColumn: 0,
            endRow: 0,
            endColumn: 0,
            addMode: false
        }
    }

    componentDidMount() {
        window.addEventListener("mouseup", this.handleTouchEndWindow);
        window.addEventListener("touchend", this.handleTouchEndWindow);
    }

    componentWillUnmount() {
        window.removeEventListener("mouseup", this.handleTouchEndWindow);
        window.removeEventListener("touchend", this.handleTouchEndWindow);
    }

    render() {
        const {rows} = this.props;
        return <>
            {rows.map((row, i) =>
                <TableRow>
                    <TableCell children={row.header} sx={{
                        position: "sticky",
                        left: 0,
                        backgroundColor: "background.paper",
                        border: 0,
                    }}/>
                    {row.cellStates.map((selected, j) =>
                        <Cell
                            beingSelected={this.isCellBeingSelected(i, j)}
                            selected={selected}
                            onTouchStart={this.handleTouchStartCell}
                            onTouchMove={this.handleTouchMoveCell}
                            colorSelected={row.colorSelected}
                            colorBeingSelected={row.colorBeingSelected}
                        />)}
                </TableRow>
            )}
        </>
    }

    handleTouchStartCell = (e: any) => {
        if (this.props.readonly) return;
        const {selectionStarted} = this.state;
        if (selectionStarted || !isValidEvent(e)) return;

        e.preventDefault();
        const {row, column} = eventToCellLocation(e);
        if (row === undefined || column === undefined) return
        this.setState({
            selectionStarted: true,
            startRow: row,
            startColumn: column,
            endRow: row,
            endColumn: column,
            addMode: !this.props.rows[row].cellStates[column]
        });
    };

    handleTouchMoveCell = (e: any) => {
        const {selectionStarted, endRow, endColumn} = this.state;
        if (!selectionStarted) return;

        e.preventDefault();
        const {row, column} = eventToCellLocation(e);
        if (row === undefined || column === undefined) return;
        if (endRow !== row || endColumn !== column) {
            this.setState({endRow: row, endColumn: column});
        }
    };

    handleTouchEndWindow = (e: any) => {
        const {selectionStarted, startRow, endRow, startColumn, endColumn, addMode} = this.state;
        if (!selectionStarted || !isValidEvent(e)) return;

        const value = this.props.rows.map((r) => Object.assign([], r.cellStates)) as CellState[][]
        const [minRow, maxRow] = minMax(startRow, endRow);
        const [minColumn, maxColumn] = minMax(startColumn, endColumn);
        if (minRow === maxRow && minColumn === maxColumn) {
            value[minRow][maxColumn] = (value[minRow][maxColumn] + 1) % 5 as CellState;
        } else {
            for (let row = minRow; row <= maxRow; row++) {
                for (let column = minColumn; column <= maxColumn; column++) {
                    value[row][column] = addMode ? 4 : 0;
                }
            }
        }

        this.setState({selectionStarted: false});
        this.props.onChange(value);
    };

    isCellBeingSelected = (row: number, column: number) => {
        const {selectionStarted, startRow, endRow, startColumn, endColumn} = this.state;

        if (!selectionStarted) return false;
        const [minRow, maxRow] = minMax(startRow, endRow);
        const [minColumn, maxColumn] = minMax(startColumn, endColumn);
        return row >= minRow && row <= maxRow && column >= minColumn && column <= maxColumn;
    };
}


export default BehaviorDragSelect;