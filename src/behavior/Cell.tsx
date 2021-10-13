import {TableCell, useMediaQuery} from "@mui/material";
import React, {useContext, useEffect, useRef} from "react";
import {ColorModeContext} from "../App";

interface CellProps {
    beingSelected: boolean
    selected: 0 | 1 | 2 | 3 | 4
    onTouchStart: any
    onTouchMove: any
    colorSelected?: string
    colorBeingSelected?: string
}

const useDarkMode = () => {
    const colorContext = useContext(ColorModeContext);
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    if (!colorContext.mode) return prefersDarkMode;
    return colorContext.mode === "dark";
}

const compareCellProps = (a: CellProps, b: CellProps) => a.selected === b.selected && a.beingSelected === b.beingSelected;
export const Cell = React.memo(function (props: CellProps) {
    const {beingSelected, selected, onTouchStart, onTouchMove, colorSelected, colorBeingSelected} = props;
    const tdRef = useRef<HTMLElement>();
    const borderColor = useDarkMode() ? 'grey.800' : 'grey.400';

    useEffect(() => {
        const td = tdRef.current;
        if (!td) return;
        td.addEventListener("touchstart", onTouchStart, {passive: false});
        td.addEventListener("touchmove", onTouchMove, {passive: false});
        return function cleanup() {
            td.removeEventListener("touchstart", onTouchStart);
            td.removeEventListener("touchmove", onTouchMove);
        }
    }, [onTouchMove, onTouchStart, tdRef]);

    if (beingSelected) {
        return <TableCell
            ref={tdRef}
            sx={{
                border: 1,
                borderColor: borderColor,
                backgroundColor: colorBeingSelected ?? "primary.main"
            }}
            onMouseDown={onTouchStart}
            onMouseMove={onTouchMove}
        />
    }
    if (selected === 0) {
        return <TableCell
            ref={tdRef}
            sx={{
                border: 1,
                borderColor: borderColor,
            }}
            onMouseDown={onTouchStart}
            onMouseMove={onTouchMove}
        />
    }
    if (selected === 4) {
        return <TableCell
            ref={tdRef}
            sx={{
                border: 1,
                borderColor: borderColor,
                backgroundColor: colorSelected ?? "secondary.main"
            }}
            onMouseDown={onTouchStart}
            onMouseMove={onTouchMove}
        />
    }
    const degrees = 100 - 25 * selected;
    return (
        <TableCell
            ref={tdRef}
            sx={{
                border: 1,
                borderColor: borderColor,
                backgroundImage: `linear-gradient(transparent ${degrees}%, ${colorSelected ?? '#9ccc65'} ${degrees}%);`,
            }}
            onMouseDown={onTouchStart}
            onMouseMove={onTouchMove}
        />
    );
}, compareCellProps);
