import {Button, IconButton, Tooltip, useMediaQuery, useTheme} from "@mui/material";
import React from "react";

export function ResponsiveIconButton(props: { description: string, icon: JSX.Element, onClick?: () => void }) {
    const theme = useTheme();
    const breakpoint = useMediaQuery(theme.breakpoints.down('sm'));
    return <>
            {breakpoint &&
            <Tooltip title={props.description}>
                <IconButton color="inherit" onClick={props.onClick} size="large">{props.icon}</IconButton>
            </Tooltip>
            }
            {!breakpoint &&
            <Button startIcon={props.icon} color="inherit" onClick={props.onClick}>{props.description}</Button>
            }
        </>;
}
