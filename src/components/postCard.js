import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    date: {
        marginBottom: 12,
    },
    provider: {
        fontSize: 14,
    },
});

const PostCard = props => {
    const classes = useStyles();
    // const [service, setService] = useState();

    // useEffect(() => {
    //     const fetchServiceInfo = async () => {
    //         const res = await axios.get(
    //             `${process.env.REACT_APP_API_HOST}/services/${props.service.id}`
    //         );
    //         setService(res.data.result);
    //     };
    //     fetchServiceInfo();
    // }, [props]);

    return (
        <Card>
            <CardContent>
                <Typography color="textSecondary" className={classes.provider}>
                    {new Date(props.creation_date * 1000).toLocaleString()}
                </Typography>
                <Typography variant="h5">
                    {decodeURIComponent(props.title)}
                </Typography>
                <Typography
                    className={
                        classes.date
                    }>{`votes: ${props.votes}`}</Typography>
            </CardContent>
        </Card>
    );
};

export default PostCard;
