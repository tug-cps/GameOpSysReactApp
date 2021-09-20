import React, {useEffect, useState} from 'react';
import {Container} from "@material-ui/core";
import ArchiveEntry from "./archive/ArchiveEntry";
import {useTranslation} from "react-i18next";
import {useSnackBar} from "./common/UseSnackBar";
import {AlertSnackbar} from "./common/AlertSnackbar";
import useDefaultTracking from "./common/Tracking";
import {PrivateRouteProps} from "./App";


interface Props extends PrivateRouteProps {
}

function Archive(props: Props) {
    const {Track} = useDefaultTracking({page: 'Archive'});
    const [dates, setDates] = useState(new Array<string>());
    const {t} = useTranslation();
    const [error, setError] = useSnackBar();
    const {backendService, setAppBar} = props;

    useEffect(() => {
        backendService.getPredictions()
            .then(setDates, setError)
            .catch(console.log)
    }, [backendService, setError])

    useEffect(() => {
        setAppBar({title: t('card_archive_title'), showBackButton: true, children: () => <></>})
    }, [t, setAppBar])

    return (
        <Track>
            <Container maxWidth="md">
                {dates.map((value) =>
                    <ArchiveEntry date={value} key={value} backendService={props.backendService}/>)}
            </Container>
            <AlertSnackbar {...error} />
        </Track>
    )
}

export default Archive;
