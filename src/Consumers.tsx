import React, {useCallback, useEffect, useState} from 'react';
import {Box, Container, List, Paper} from "@material-ui/core";
import {ConsumerModel} from "./service/Model";
import ConsumerCard from "./consumers/ConsumerCard";
import {useTranslation} from "react-i18next";
import {AlertSnackbar} from "./common/AlertSnackbar";
import {useSnackBar} from "./common/UseSnackBar";
import {InfoOutlined} from "@material-ui/icons";
import useDefaultTracking from "./common/Tracking";
import {InfoDialog, Lorem, useInfoDialog} from "./common/InfoDialog";
import {ResponsiveIconButton} from "./common/ResponsiveIconButton";
import {PrivateRouteProps} from "./App";

interface Props extends PrivateRouteProps {
}

function Consumers(props: Props) {
    const {Track} = useDefaultTracking({page: 'Consumers'});
    const [consumers, setConsumers] = useState<ConsumerModel[]>([]);
    const [error, setError] = useSnackBar();
    const [infoProps, openInfo] = useInfoDialog();
    const {t} = useTranslation();
    const {backendService, setAppBar} = props;

    useEffect(() => {
        backendService.getConsumers()
            .then(setConsumers, setError)
            .catch(console.log)
    }, [backendService, setError])

    const applyChangeActive = useCallback((consumer: ConsumerModel) =>
            backendService.putConsumer({...consumer, active: !consumer.active})
                .then(() => backendService.getConsumers())
                .then(setConsumers, setError)
                .catch(console.log),
        [backendService, setError])

    useEffect(() => setAppBar({
        title: t('edit_consumers'),
        showBackButton: true,
        children: () => <ResponsiveIconButton description={t('info')} icon={<InfoOutlined/>} onClick={openInfo}/>
    }), [t, setAppBar, openInfo])

    return (
        <Track>
            <Container maxWidth="sm">
                <Box pb={10}>
                    <Paper variant="outlined">
                        <List>
                            {consumers && consumers.map((it) =>
                                <ConsumerCard
                                    key={it.consumerId}
                                    consumer={it}
                                    clickActive={applyChangeActive}
                                />
                            )}
                        </List>
                    </Paper>
                </Box>
            </Container>
            <AlertSnackbar {...error}/>
            <InfoDialog title={t('info')} content={<Lorem/>} {...infoProps}/>
        </Track>
    );
}

export default Consumers;
