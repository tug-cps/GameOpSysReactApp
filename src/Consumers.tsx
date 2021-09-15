import React, {useEffect, useState} from 'react';
import {Box, Container, Fab, List, Paper} from "@material-ui/core";
import BackendService from "./service/BackendService";
import DefaultAppBar from "./common/DefaultAppBar";
import {ConsumerModel} from "./service/Model";
import ConsumerCard from "./consumers/ConsumerCard";
import {useTranslation} from "react-i18next";
import {AlertSnackbar} from "./common/AlertSnackbar";
import {DeleteConsumerDialog, useDeleteConsumerDialog} from "./consumers/DeleteConsumerDialog";
import {EditConsumerDialog, useEditConsumerDialog} from "./consumers/EditConsumerDialog";
import {CreateConsumerDialog, useCreateConsumerDialog} from "./consumers/CreateConsumerDialog";
import {useSnackBar} from "./common/UseSnackBar";
import {Add, InfoOutlined} from "@material-ui/icons";
import useDefaultTracking from "./common/Tracking";
import {InfoDialog, Lorem, useInfoDialog} from "./common/InfoDialog";
import {ResponsiveIconButton} from "./common/ResponsiveIconButton";

interface Props {
    backendService: BackendService
}

function Consumers(props: Props) {
    const {Track} = useDefaultTracking({page: 'Consumers'});
    const [consumers, setConsumers] = useState<ConsumerModel[]>([]);
    const [error, setError] = useSnackBar();
    const [infoProps, openInfo] = useInfoDialog();
    const {backendService} = props;

    useEffect(() => {
        backendService.getConsumers()
            .then(setConsumers, setError)
            .catch(console.log)
    }, [backendService, setError])

    const refresh = () => {
        backendService.getConsumers()
            .then(setConsumers, setError)
            .catch(console.log)
    }

    const [deleteProps, setDelete] = useDeleteConsumerDialog((consumer, onClose) =>
        backendService.removeConsumer(consumer.consumerId)
            .then(onClose)
            .then(refresh)
            .catch(setError)
    );

    const [editProps, setEdit] = useEditConsumerDialog((consumer, onClose) =>
        backendService.putConsumer(consumer)
            .then(onClose)
            .then(refresh)
            .catch(setError)
    );

    const [createProps, setCreate] = useCreateConsumerDialog((consumerName, onClose) =>
        backendService.postConsumer(consumerName)
            .then(onClose)
            .then(refresh)
            .catch(setError)
    );

    const applyChangeActive = (consumer: ConsumerModel) =>
        backendService.putConsumer({...consumer, active: !consumer.active})
            .then(refresh)
            .catch(setError)

    const {t} = useTranslation();
    return (
        <Track>
            <DefaultAppBar title={t('edit_consumers')}>
                <ResponsiveIconButton description={t('info')} icon={<InfoOutlined/>} onClick={openInfo}/>
            </DefaultAppBar>
            <Container maxWidth="sm" disableGutters>
                <Box my={1} pb={10}>
                    <Paper variant="outlined">
                        <List>
                            {consumers && consumers.map((it) =>
                                <ConsumerCard
                                    consumer={it}
                                    clickEdit={(c) => setEdit(c)}
                                    clickActive={(c) => applyChangeActive(c)}
                                    clickDelete={(c) => setDelete(c)}
                                />
                            )}
                        </List>
                    </Paper>
                </Box>
            </Container>
            <Fab color="primary" aria-label="add" onClick={setCreate}><Add/></Fab>
            <AlertSnackbar {...error}/>
            <CreateConsumerDialog {...createProps} />
            <EditConsumerDialog {...editProps} />
            <DeleteConsumerDialog {...deleteProps} />
            <InfoDialog title={t('info')} content={<Lorem/>} {...infoProps}/>
        </Track>
    );
}

export default Consumers;
