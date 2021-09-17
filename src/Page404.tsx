import {Box, Button, Typography} from "@material-ui/core";
import {Link} from "react-router-dom";
import React from "react";

export function Page404(props: { path: string }) {
    return (
        <Box m={16} textAlign='center'>
            <Typography variant="h1">404</Typography>
            <Typography variant="h5">Page not found</Typography>
            <Box m={2}>
                <Button color="primary" variant="contained" component={Link} to={props.path}>Go home</Button>
            </Box>
        </Box>
    )
}
