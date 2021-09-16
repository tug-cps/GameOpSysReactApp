import React, {useEffect, useState} from 'react';
import {Card, CardContent, Container, createStyles, Theme, Typography, WithStyles} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import DefaultAppBar, {Content, Root} from "./common/DefaultAppBar";
import BackendService from "./service/BackendService";
import {PowerEntry} from "./power/PowerEntry";
import useDefaultTracking from "./common/Tracking";
import {useTranslation} from "react-i18next";

const styles = ({spacing}: Theme) => createStyles({
    card: {
        marginTop: spacing(2)
    },
});

interface Props extends WithStyles<typeof styles> {
    backendService: BackendService
}

function Power(props: Props) {
    const {Track} = useDefaultTracking({page: 'Power'});
    const [dates, setDates] = useState<string[]>();
    const {classes, backendService} = props;
    const {t} = useTranslation();

    useEffect(() => {
        backendService.getProcessedConsumptions()
            .then(setDates)
            .catch(console.log);
    }, [backendService])

    return (
        <Track>
            <Root>
                <DefaultAppBar title={t('card_power_title')}/>
                <Content>
                    {dates &&
                    <Container maxWidth="md">
                        {dates.map((date) =>
                            <Card variant="outlined" key={date} className={classes.card}>
                                <CardContent>
                                    <Typography variant="h6">{date}</Typography>
                                    <PowerEntry date={date} backendService={backendService}/>
                                </CardContent>
                            </Card>
                        )}
                    </Container>
                    }
                </Content>
            </Root>
        </Track>
    )
}

export default withStyles(styles)(Power);
