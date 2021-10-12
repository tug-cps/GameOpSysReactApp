import InfoOutlined from "@mui/icons-material/InfoOutlined";
import {Container, DialogContentText, List, Paper} from "@mui/material";
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {PrivateRouteProps} from "./App";
import {AlertSnackbar} from "./common/AlertSnackbar";
import {InfoDialog, useInfoDialog} from "./common/InfoDialog";
import {ResponsiveIconButton} from "./common/ResponsiveIconButton";
import useDefaultTracking from "./common/Tracking";
import {useSnackBar} from "./common/UseSnackBar";
import ConsumerCard from "./consumers/ConsumerCard";
import {ConsumerModel} from "./service/Model";

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

    const content = () => <DialogContentText>
        {t('consumer_help').split('\n').map((s) => <p>{s}</p>)}
    </DialogContentText>

    return (
        <Track>
            <Container maxWidth="sm" sx={{paddingTop: 1, paddingBottom: 10}}>
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
            </Container>
            <AlertSnackbar {...error}/>
            <InfoDialog title={t('info')} content={content()} {...infoProps}/>
        </Track>
    );
}

export default Consumers;
