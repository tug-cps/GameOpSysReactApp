import {Box, Card, CardActionArea, CardContent, CardMedia, SvgIcon, Typography} from "@mui/material";
import React from "react";
import {Link as RouterLink} from "react-router-dom";

export interface DestinationCardProps {
    to: string
    icon: any
    title: string
    subtitle: string
    done?: boolean
}

export function DestinationCard(props: DestinationCardProps) {
    const {to, icon, title, subtitle, done} = props;
    return (
        <Card sx={{borderColor: done ? undefined : "warning.main"}}>
            <CardActionArea component={RouterLink} to={to}>
                <Box display="flex">
                    <CardMedia sx={{
                        backgroundColor: done ? "secondary.main" : "warning.main",
                        display: "flex",
                        alignItems: "center",
                        padding: "8px"
                    }}>
                        <SvgIcon component={icon} sx={{color: 'background.paper'}}/>
                    </CardMedia>
                    <CardContent>
                        <Typography variant="h6">{title}</Typography>
                        <Typography color="textSecondary" noWrap>{subtitle}</Typography>
                    </CardContent>
                </Box>
            </CardActionArea>
        </Card>
    )
}
