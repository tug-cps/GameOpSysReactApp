import {Container, Stack} from "@mui/material";
import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {PrivateRouteProps} from "./App";
import useDefaultTracking from "./common/Tracking";
import {PowerEntry} from "./power/PowerEntry";

interface Props extends PrivateRouteProps {
}

function Power(props: Props) {
    const {Track} = useDefaultTracking({page: 'Power'});
    const [dates, setDates] = useState<string[]>();
    const {backendService, setAppBar} = props;
    const {t} = useTranslation();

    useEffect(() => {
        backendService.getProcessedConsumptions()
            .then(setDates)
            .catch(console.log);
    }, [backendService])

    useEffect(() => setAppBar({
        title: t('card_power_title'),
        showBackButton: true,
        children: () => <></>
    }), [t, setAppBar])

    return (
        <Track>
            {dates &&
            <Container maxWidth="md" sx={{paddingTop: 1}}>
                <Stack spacing={1}>
                    {dates.map((date) => <PowerEntry date={date} backendService={backendService}/>)}
                </Stack>
            </Container>
            }
        </Track>
    );
}

export default (Power);
