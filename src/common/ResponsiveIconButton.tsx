import {Badge, Button, IconButton, Tooltip, useMediaQuery, useTheme} from "@mui/material";
import React from "react";

interface Props {
    description: string
    icon: JSX.Element
    onClick?: () => void
    requiresAttention?: boolean
}

function AttentionIcon(props: { requiresAttention?: boolean, icon: JSX.Element }) {
    return <Badge invisible={!props.requiresAttention} variant="dot" color="info">{props.icon}</Badge>
}

function SmallIconButton(props: Props) {
    return (
        <Tooltip title={props.description}>
            <IconButton
                color="inherit"
                onClick={props.onClick}
                size="large"
                children={<AttentionIcon {...props}/>}
            />
        </Tooltip>
    )
}

function LargeIconButton(props: Props) {
    return (
        <Button startIcon={<AttentionIcon {...props}/>}
                color="inherit"
                onClick={props.onClick}
                children={props.description}
        />
    )
}

export function ResponsiveIconButton(props: Props) {
    const theme = useTheme();
    const breakpoint = useMediaQuery(theme.breakpoints.down('sm'));
    if (breakpoint) return <SmallIconButton {...props}/>
    return <LargeIconButton {...props}/>
}
