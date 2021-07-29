import React from 'react';
import {Container, Typography} from "@material-ui/core";
import DefaultAppBar from "./common/DefaultAppBar";


class Predictions extends React.Component {
    render() {
        return (
            <div>
                <DefaultAppBar title='Predictions'/>
                <Container maxWidth="md">
                    <Typography variant="h4">Not implemented</Typography>
                </Container>
            </div>
        )
    }
}

export default Predictions;