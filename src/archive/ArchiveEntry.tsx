import React from "react";
import {ListItem, ListItemAvatar, ListItemText} from "@mui/material";
import {useHistory} from "react-router-dom";
import {Done} from "@mui/icons-material";
import {parse} from "date-fns";
import {useTranslation} from "react-i18next";

function ArchiveEntry(props: { date: string }) {
    const {date} = props;
    const parsedDate = parse(date, 'yyyy-MM-dd', new Date());
    const history = useHistory();
    const {t} = useTranslation();

    return (
        <ListItem button onClick={() => history.push(`/pastbehavior?date=${date}`)}>
            <ListItemAvatar><Done/></ListItemAvatar>
            <ListItemText>{t('archive_entry_date', {date: parsedDate})}</ListItemText>
        </ListItem>
    )
}

export default ArchiveEntry;
