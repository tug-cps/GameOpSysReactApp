import Delete from "@mui/icons-material/Delete";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
    Avatar,
    IconButton,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    Tooltip
} from "@mui/material";
import React from "react";
import {useTranslation} from "react-i18next";
import {consumerLookup, translate} from "../common/ConsumerTools";
import {ConsumerModel} from "../service/Model";

interface Props {
    consumer: ConsumerModel,
    clickEdit?: (consumer: ConsumerModel) => void,
    clickActive?: (consumer: ConsumerModel) => void,
    clickDelete?: (consumer: ConsumerModel) => void
}

export const compareProps = (a: Props, b: Props) => compareConsumers(a.consumer, b.consumer)
export const compareConsumers = (a: ConsumerModel, b: ConsumerModel) =>
    a.type === b.type &&
    a.consumerId === b.consumerId &&
    a.active === b.active

const ConsumerCard = React.memo((props: Props) => {
    const {t} = useTranslation();
    const {consumer, clickEdit, clickActive, clickDelete} = props;
    const button = !!clickEdit;
    const showButtonTooltip = consumer.active ? t("hide_consumer") : t("show_consumer");
    const consumerName = translate(consumer.name, consumer.customName);
    const consumerType = consumerLookup(consumer.type);
    return (
        <ListItem key={consumer.consumerId}
                  role={undefined}
                  button={button as false | undefined}
                  onClick={() => clickEdit && clickEdit(consumer)}>
            <ListItemAvatar>
                <Avatar sx={{backgroundColor: consumerType.color}} children={consumerType.icon}/>
            </ListItemAvatar>
            <ListItemText primary={consumerName}/>
            <ListItemSecondaryAction>
                {clickActive &&
                <Tooltip title={showButtonTooltip}>
                    <IconButton
                        edge="end"
                        arial-label={showButtonTooltip}
                        onClick={() => clickActive(consumer)}
                        size="large">
                        {consumer.active ? <Visibility/> : <VisibilityOff/>}
                    </IconButton>
                </Tooltip>
                }
                {clickDelete &&
                <IconButton
                    edge="end"
                    arial-label="delete"
                    onClick={() => clickDelete(consumer)}
                    size="large">
                    <Delete/>
                </IconButton>
                }
            </ListItemSecondaryAction>
        </ListItem>
    );
}, compareProps)

export default ConsumerCard;
