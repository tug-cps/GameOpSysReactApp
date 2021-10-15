import {useTranslation} from "react-i18next";
import {Box, Button, Container, LinearProgress, Paper, Stack, Typography} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import React from "react";

const style = {display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"};

export function LoadingPage(props: { retry: () => void }) {
    const {t} = useTranslation();
    return (
        <Container maxWidth="xs" sx={style}>
            <Paper square variant="outlined" sx={{width: "100%", p: 2}}>
                <Typography variant="h5" textAlign="center" children={t('logging_in')}/>
                <Box mt={5}/>
                <LinearProgress/>
                <Stack direction="row" sx={{justifyContent: "flex-end", pt: 2}}>
                    <Button component={RouterLink} to="/logout" sx={{mr: 2}} children={t('logout')}/>
                    <Button onClick={props.retry} children={t('retry')}/>
                </Stack>
            </Paper>
        </Container>
    )
}
