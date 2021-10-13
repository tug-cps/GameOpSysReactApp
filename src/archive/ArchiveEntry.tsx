import React from "react";
import {ListItem, ListItemAvatar, ListItemText} from "@mui/material";
import {useHistory} from "react-router-dom";
import {Done} from "@mui/icons-material";
import {useTranslation} from "react-i18next";
import {useParsedDate} from "../common/Date";

function ArchiveEntry(props: { date: string }) {
    const {date} = props;
    const parsedDate = useParsedDate(date);
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
