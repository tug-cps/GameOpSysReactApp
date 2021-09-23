/*  Adapted from https://github.com/mcjohnalds/react-table-drag-select */

import React from "react";
import {TableCell, TableRow} from "@mui/material";

export interface Row {
    header: JSX.Element;
    cellStates: boolean[];
}

interface Props {
    maxRows: number
    maxColumns: number
    onSelectionStart: (location: { row: number, column: number }) => {}
    onInput: () => void
    onChange: (value: boolean[][]) => void
    rows: Row[]
}

interface State {
    selectionStarted: boolean
    startRow: number
    startColumn: number
    endRow: number
    endColumn: number
    addMode: boolean
}

class BehaviorDragSelect extends React.Component<React.PropsWithChildren<Props> & typeof BehaviorDragSelect.defaultProps, State> {
    static defaultProps = {
        maxRows: Infinity,
        maxColumns: Infinity,
        onSelectionStart: () => {
        },
        onInput: () => {
        },
        onChange: (value: boolean[][]) => {
        },
        rows: [] as Row[]
    };

    constructor(props: Readonly<React.PropsWithChildren<Props> & typeof BehaviorDragSelect.defaultProps> | React.PropsWithChildren<Props> & typeof BehaviorDragSelect.defaultProps) {
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
        return this.props.rows.map((row, i) =>
            <TableRow><TableCell variant="head">{row.header}</TableCell>
                {row.cellStates.map((selected, j) =>
                    <Cell
                        disabled={false}
                        beingSelected={this.isCellBeingSelected(i, j)}
                        selected={selected}
                        onTouchStart={this.handleTouchStartCell}
                        onTouchMove={this.handleTouchMoveCell}
                    />)}
            </TableRow>
        )
    }

    handleTouchStartCell = (e: any) => {
        const isLeftClick = e.button === 0;
        const isTouch = e.type !== "mousedown";
        if (!this.state.selectionStarted && (isLeftClick || isTouch)) {
            e.preventDefault();
            const {row, column} = eventToCellLocation(e);
            if (row === undefined || column === undefined) return
            this.props.onSelectionStart({row, column});
            this.setState({
                selectionStarted: true,
                startRow: row,
                startColumn: column,
                endRow: row,
                endColumn: column,
                addMode: !this.props.rows[row].cellStates[column]
            });
        }
    };

    handleTouchMoveCell = (e: any) => {
        if (this.state.selectionStarted) {
            e.preventDefault();
            const {row, column} = eventToCellLocation(e);
            if (row === undefined || column === undefined) return
            const {startRow, startColumn, endRow, endColumn} = this.state;

            if (endRow !== row || endColumn !== column) {
                const nextRowCount = Math.abs(row - startRow) + 1;
                const nextColumnCount = Math.abs(column - startColumn) + 1;

                if (nextRowCount <= this.props.maxRows) {
                    this.setState({endRow: row});
                }
                if (nextColumnCount <= this.props.maxColumns) {
                    this.setState({endColumn: column});
                }
            }
        }
    };

    handleTouchEndWindow = (e: any) => {
        const isLeftClick = e.button === 0;
        const isTouch = e.type !== "mousedown";
        if (this.state.selectionStarted && (isLeftClick || isTouch)) {
            const value = this.props.rows.map((r) => Object.assign([], r.cellStates)) as boolean[][]
            const minRow = Math.min(this.state.startRow, this.state.endRow);
            const maxRow = Math.max(this.state.startRow, this.state.endRow);
            for (let row = minRow; row <= maxRow; row++) {
                const minColumn = Math.min(this.state.startColumn, this.state.endColumn);
                const maxColumn = Math.max(this.state.startColumn, this.state.endColumn);
                for (let column = minColumn; column <= maxColumn; column++) {
                    value[row][column] = this.state.addMode;
                }
            }
            this.setState({selectionStarted: false});
            this.props.onChange(value);
        }
    };

    isCellBeingSelected = (row: number, column: number) => {
        if (!this.state.selectionStarted) return false;

        const {startRow, endRow, startColumn, endColumn} = this.state;
        const minRow = Math.min(startRow, endRow);
        const maxRow = Math.max(startRow, endRow);
        const minColumn = Math.min(startColumn, endColumn);
        const maxColumn = Math.max(startColumn, endColumn);

        return row >= minRow && row <= maxRow && column >= minColumn && column <= maxColumn;
    };
}

interface CellProps {
    disabled: boolean
    beingSelected: boolean
    selected: boolean
    onTouchStart: any
    onTouchMove: any
}

class Cell extends React.Component<CellProps> {
    td: any

    shouldComponentUpdate(nextProps: Readonly<CellProps>, nextState: Readonly<{}>, nextContext: any): boolean {
        return nextProps.selected !== this.props.selected || nextProps.beingSelected !== this.props.beingSelected
    }

    componentDidMount() {
        // We need to call addEventListener ourselves so that we can pass
        // {passive: false}
        this.td.addEventListener("touchstart", this.handleTouchStart, {passive: false});
        this.td.addEventListener("touchmove", this.handleTouchMove, {passive: false});
    }

    componentWillUnmount() {
        this.td.removeEventListener("touchstart", this.handleTouchStart);
        this.td.removeEventListener("touchmove", this.handleTouchMove);
    }

    render() {
        const {disabled, beingSelected, selected, onTouchStart, onTouchMove, ...props} = this.props;
        let className = ""
        if (disabled) {
            className += " cell-disabled";
        } else {
            className += " cell-enabled";
            if (selected) {
                className += " cell-selected";
            }
            if (beingSelected) {
                className += " cell-being-selected";
            }
        }

        return (
            <TableCell
                ref={td => (this.td = td)}
                className={className}
                onMouseDown={this.handleTouchStart}
                onMouseMove={this.handleTouchMove}
                {...props}
            />
        );
    }

    handleTouchStart = (e: any) => !this.props.disabled && this.props.onTouchStart(e);
    handleTouchMove = (e: any) => !this.props.disabled && this.props.onTouchMove(e);
}

function eventToCellLocation(e: any): { row: number, column: number } {
    let target;
    // For touchmove and touchend events, e.target and e.touches[n].target are
    // wrong, so we have to rely on elementFromPoint(). For mouse clicks, we have
    // to use e.target.
    if (e.touches) {
        const touch = e.touches[0];
        target = document.elementFromPoint(touch.clientX, touch.clientY);
    } else {
        target = e.target;
        while (target.tagName !== "TD") target = target.parentNode;
    }
    return {
        row: target?.parentNode?.rowIndex - 2,
        column: target?.cellIndex - 1
    };
}

export default BehaviorDragSelect;