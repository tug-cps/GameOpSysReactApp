import {Badge, Button, IconButton, Tooltip, useMediaQuery, useTheme} from "@mui/material";
import React from "react";

interface Props {
    description: string
    icon: JSX.Element
    onClick?: () => void
    requiresAttention?: boolean
}

export function ResponsiveIconButton(props: Props) {
    const theme = useTheme();
    const breakpoint = useMediaQuery(theme.breakpoints.down('sm'));

    const AttentionIcon = () => <Badge invisible={!props.requiresAttention}
                                       variant="dot"
                                       color="info">{props.icon}</Badge>
    return <>
        {breakpoint &&
        <Tooltip title={props.description}>
            <IconButton color="inherit" onClick={props.onClick} size="large"><AttentionIcon/></IconButton>
        </Tooltip>
        }
        {!breakpoint &&
        <Button startIcon={<AttentionIcon/>} color="inherit" onClick={props.onClick}>{props.description}</Button>
        }
    </>;
}
