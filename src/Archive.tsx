import React, {useEffect, useState} from 'react';
import {Box, Container} from "@material-ui/core";
import BackendService from "./service/BackendService";
import DefaultAppBar from "./common/DefaultAppBar";
import ArchiveEntry from "./ArchiveEntry";
import {useTranslation} from "react-i18next";
import {useSnackBar} from "./common/UseSnackBar";
import {AlertSnackbar} from "./common/AlertSnackbar";


interface Props {
    backendService: BackendService
}

function Archive(props: Props) {
    const [dates, setDates] = useState(new Array<string>());
    const {backendService} = props;
    const {t} = useTranslation();
    const [error, setError] = useSnackBar();

    useEffect(() => {
        backendService.getPredictions()
            .then(setDates, setError)
            .catch(console.log)
    }, [backendService, setError])
    return (
        <>
            <DefaultAppBar title={t('card_archive_title')}/>
            <Box py={1}>
                <Container maxWidth="md">
                    {dates.map((value) =>
                        <ArchiveEntry date={value} key={value} backendService={props.backendService}/>)}
                </Container>
            </Box>
            <AlertSnackbar {...error} />
        </>
    )
}

export default Archive;
