export function eventToCellLocation(e: any): { row: number, column: number } {
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

export const minMax = (a: number, b: number) => [Math.min(a, b), Math.max(a, b)];
export const isValidEvent = (e: any) => e.button === 0 || e.type !== "mousedown";
