import {Box, Button, Typography} from "@mui/material";
import React from "react";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";

function Page404(props: {}) {
    const {t} = useTranslation();
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '70vh',
            justifyContent: 'center'
        }}>
            <Typography variant="h1" children="404" gutterBottom/>
            <Typography variant="h5" paragraph children={t('page_not_found')}/>
            <Button
                color="primary"
                variant="contained"
                component={Link}
                to='/'
            >{t('go_back')}</Button>
        </Box>
    )
}

export default Page404;
