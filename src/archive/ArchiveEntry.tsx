import React from "react";
import {ListItem, ListItemAvatar, ListItemText} from "@mui/material";
import {useHistory} from "react-router-dom";
import {Done} from "@mui/icons-material";

function ArchiveEntry(props: { date: string }) {
    const {date} = props;
    const history = useHistory();

    return (
        <ListItem button onClick={() => history.push(`/pastbehavior?date=${date}`)}>
            <ListItemAvatar><Done/></ListItemAvatar>
            <ListItemText>{date}</ListItemText>
        </ListItem>
    )
}

export default ArchiveEntry;
