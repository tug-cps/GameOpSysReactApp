import {ConsumerModel} from "./service/Model";
import {Avatar, IconButton, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import {iconLookup, translate} from "./common/ConsumerTools";
import {Visibility, VisibilityOff} from "@material-ui/icons";

function ConsumerCard(props: {
    consumer: ConsumerModel,
    clickEdit?: (consumer: ConsumerModel) => void,
    clickActive?: (consumer: ConsumerModel) => void,
    clickDelete?: (consumer: ConsumerModel) => void
}) {
    const {consumer, clickEdit, clickActive, clickDelete} = props;
    const button = !!clickEdit
    return (
        <ListItem key={consumer.consumerId}
                  role={undefined}
                  button={button as false | undefined}
                  onClick={() => clickEdit && clickEdit(consumer)}>
            <ListItemAvatar><Avatar>{iconLookup(consumer.type)}</Avatar></ListItemAvatar>
            <ListItemText primary={translate(consumer.name, consumer.customName)}/>
            <ListItemSecondaryAction>
                {clickActive && <IconButton
                    edge="end"
                    arial-label="show or hide"
                    onClick={() => clickActive(consumer)}>
                    {consumer.active ? <Visibility/> : <VisibilityOff/>}
                </IconButton>}
                {clickDelete && <IconButton
                    edge="end"
                    arial-label="delete"
                    onClick={() => clickDelete(consumer)}>
                    <DeleteIcon/>
                </IconButton>}
            </ListItemSecondaryAction>
        </ListItem>
    )
}

export default ConsumerCard;
