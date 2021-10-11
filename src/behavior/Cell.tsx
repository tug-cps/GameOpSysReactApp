import React, {useEffect, useRef} from "react";
import {TableCell} from "@mui/material";

interface CellProps {
    beingSelected: boolean
    selected: 0 | 1 | 2 | 3 | 4
    onTouchStart: any
    onTouchMove: any
}

const compareCellProps = (a: CellProps, b: CellProps) => a.selected === b.selected && a.beingSelected === b.beingSelected;
export const Cell = React.memo(function (props: CellProps) {
    const {beingSelected, selected, onTouchStart, onTouchMove} = props;
    const tdRef = useRef<HTMLElement>();

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
            sx={{border: 1, borderColor: 'divider', backgroundColor: "primary.main"}}
            onMouseDown={onTouchStart}
            onMouseMove={onTouchMove}
        />
    }
    if (selected === 0) {
        return <TableCell
            ref={tdRef}
            sx={{border: 1, borderColor: 'divider'}}
            onMouseDown={onTouchStart}
            onMouseMove={onTouchMove}
        />
    }
    if (selected === 4) {
        return <TableCell
            ref={tdRef}
            sx={{border: 1, borderColor: 'divider', backgroundColor: "secondary.main"}}
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
                borderColor: 'divider',
                background: `linear-gradient(#fff0 ${degrees}%, #9ccc65 ${degrees}%);`,
            }}
            onMouseDown={onTouchStart}
            onMouseMove={onTouchMove}
        />
    );
}, compareCellProps);
