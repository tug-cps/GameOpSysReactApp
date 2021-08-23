import {ConsumerModel} from "./service/Model";
import {IconButton, ListItem, ListItemSecondaryAction, ListItemText} from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";

function ConsumerCard(props: {
    consumer: ConsumerModel,
    clickEdit: (consumer: ConsumerModel) => void,
    clickActive: (consumer: ConsumerModel) => void,
    clickDelete: (consumer: ConsumerModel) => void
}) {
    const {consumer} = props;
    return (
        <ListItem key={consumer.consumerId} role={undefined} button
                  onClick={() => props.clickEdit(consumer)}>
            <ListItemText primary={consumer.name}/>
            <ListItemSecondaryAction>
                <IconButton
                    edge="end"
                    arial-label="show or hide"
                    onClick={() => props.clickActive(consumer)}>
                    {consumer.active ? <VisibilityIcon/> : <VisibilityOffIcon/>}
                </IconButton>
                <IconButton
                    edge="end"
                    arial-label="delete"
                    onClick={() => props.clickDelete(consumer)}>
                    <DeleteIcon/>
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    )
}

export default ConsumerCard;
