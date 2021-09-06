import React, {useEffect, useState} from 'react';
import {Container, createStyles, Theme, WithStyles} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import BackendService from "./service/BackendService";
import DefaultAppBar from "./common/DefaultAppBar";
import ArchiveEntry from "./ArchiveEntry";

const styles = ({spacing}: Theme) => createStyles({
    root: {
        flexGrow: 1,
    },
    card: {
        marginTop: spacing(2)
    },
});

interface Props extends WithStyles<typeof styles> {
    backendService: BackendService
}

function Archive(props: Props) {
    const [dates, setDates] = useState(new Array<string>());
    const {backendService} = props;

    useEffect(() => {
        backendService.getPredictions()
            .then((response) => {setDates(response);})
            .catch((reason) => {
                console.log(reason)
            })
    }, [backendService])
    const {classes} = props;
    return (
        <div className={classes.root}>
            <DefaultAppBar title='Predictions'/>
            <Container maxWidth="md">
                {dates.map((value) => {
                    return (<ArchiveEntry date={value} key={value} backendService={props.backendService}/>)
                })}
            </Container>
        </div>
    )
}

export default withStyles(styles)(Archive);
