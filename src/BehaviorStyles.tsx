import {createStyles, Theme} from "@material-ui/core";

export const styles = ({spacing, palette}: Theme) => createStyles({
    container: {
        overflow: 'auto',
        maxHeight: 'calc(100vh - 140px)'
    },
    avatar: {
        width: spacing(4),
        height: spacing(4),
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
