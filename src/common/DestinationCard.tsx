import {InfoOutlined} from "@mui/icons-material";
import {Box, Card, CardActionArea, CardContent, CardMedia, IconButton, SvgIcon, Typography} from "@mui/material";
import React from "react";
import {Link as RouterLink} from "react-router-dom";

export interface DestinationCardProps {
    to: string
    icon: React.ElementType
    title: string
    subtitle: string
    done?: boolean
    secondaryTo?: string
    secondaryIcon?: React.ElementType
}

export function DestinationCard(props: DestinationCardProps) {
    const {to, icon, title, subtitle, done} = props;
    return (
        <Card sx={{borderColor: done ? undefined : "warning.main", display: "flex", flexDirection: "row"}}>
            <CardActionArea component={RouterLink} to={to}>
                <Box sx={{display: "flex", flexGrow: 1}}>
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
            {props.secondaryTo &&
            <IconButton component={RouterLink} to={props.secondaryTo} size="large" sx={{alignSelf: "center", m: 1}}>
                <SvgIcon component={props.secondaryIcon ?? InfoOutlined}/>
            </IconButton>
            }
        </Card>
    )
}
