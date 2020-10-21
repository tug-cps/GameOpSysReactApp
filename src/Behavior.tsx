import React from 'react';
import {Container, Typography} from "@material-ui/core";
import DefaultAppBar from "./common/DefaultAppBar";


class Behavior extends React.Component {
    render() {
        return (
            <div>
                <DefaultAppBar title='Behavior' />
                <Container maxWidth="md">
                    <Typography variant="h4">Not implemented</Typography>
                </Container>
            </div>
        )
    }
}

export default Behavior;
