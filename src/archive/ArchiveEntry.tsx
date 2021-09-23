import React, {useEffect, useState} from "react";
import BackendService from "../service/BackendService";
import {UserPredictionModel} from "../service/Model";
import {Card, CardActionArea, CardContent, Typography} from "@mui/material";

function ArchiveEntry(props: { date: string, backendService: BackendService }) {
    const {date, backendService} = props;
    const [predictions, setPredictions] = useState(new Array<UserPredictionModel>());
    useEffect(() => {
        backendService.getPrediction(date)
            .then((prediction) => setPredictions(prediction))
            .catch(console.log);
    }, [backendService, date]);

    return (
        <Card variant="outlined">
            <CardActionArea>
                <CardContent>
                    <Typography variant="h6">{date}</Typography>
                    {predictions.map((prediction) =>
                        (
                            <Typography variant="body1" key={prediction.consumerId}>
                                {prediction.data.map((v) => v ? '█' : '░')}
                            </Typography>
                        ))}
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default ArchiveEntry;
