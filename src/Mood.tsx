import React from 'react';
import DefaultAppBar from "./common/DefaultAppBar";
import {Box, Card, CardContent, Container, IconButton, Tooltip, Typography} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import {SaveAlt} from "@material-ui/icons";
import {Bubble} from "react-chartjs-2";
import 'chartjs-plugin-dragdata';
import {useSnackBar} from "./common/UseSnackBar";
import {AlertSnackbar} from "./common/AlertSnackbar";


function DraggableGraph(props: {}) {
    return <Bubble
        data={{
            labels: ["Red"],
            datasets: [{
                label: 'Bubble',
                data: [{x: 0, y: 0, r: 30}],
                borderWidth: 1,
                backgroundColor: 'rgb(189, 80, 105, 1)',
                pointHitRadius: 25
            }]
        }}
        options={{
            scales: {
                y: {
                    max: 10,
                    min: -10
                },
                x: {
                    max: 10,
                    min: -10
                }
            },
            plugins: {
                dragData: {
                    round: 2,
                    dragX: true,
                    showTooltip: true,
                }
            }
        }}/>
}

function Mood(props: {}) {
    const {t} = useTranslation()
    const [success, setSuccess] = useSnackBar();

    return <React.Fragment>
        <DefaultAppBar title={t('card_mood_title')}>
            <Tooltip title={t('save') as string}>
                <IconButton color="inherit"
                            onClick={() => setSuccess(t('behavior_changes_saved'))}><SaveAlt/></IconButton>
            </Tooltip>
        </DefaultAppBar>
        <Container>
            <Box py={1}>
                <Card>
                    <CardContent>
                        <Typography variant="h4" align="center">Bitte wählen Sie Ihre aktuelle Stimmung aus</Typography>
                    </CardContent>
                    <CardContent>
                        <DraggableGraph/>
                    </CardContent>
                </Card>
            </Box>
        </Container>
        <AlertSnackbar {...success} severity="success"/>
    </React.Fragment>
}

export default Mood;