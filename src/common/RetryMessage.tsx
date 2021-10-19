import {Button, Container, Paper, Typography} from "@mui/material";
import React from "react";
import {useTranslation} from "react-i18next";

function RetryMessage(props: { retry: () => void }) {
    const {t} = useTranslation();
    return (
        <Container maxWidth="sm">
            <Paper variant="outlined" square sx={{p: 2, mt: 3, display: "flex", flexDirection: "column"}}>
                <Typography>{t('error_please_retry')}</Typography>
                <Button
                    sx={{mt: 5, alignSelf: "flex-end"}}
                    onClick={props.retry}
                    children={t('retry')}/>
            </Paper>
        </Container>
    )
}

export default RetryMessage;
