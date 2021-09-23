import {Card, CardContent, Container, Typography} from "@mui/material";
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
            <Container maxWidth="md">
                {dates.map((date) =>
                    <Card variant="outlined" key={date} sx={{marginTop: 2}}>
                        <CardContent>
                            <Typography variant="h6">{date}</Typography>
                            <PowerEntry date={date} backendService={backendService}/>
                        </CardContent>
                    </Card>
                )}
            </Container>
            }
        </Track>
    );
}

export default (Power);
