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
const decodeHTML = html => {
    var txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
};
const PostCard = props => {
    const classes = useStyles();
    const [collapse, setCollapse] = useState(true);
    const [thread, setThread] = useState([]);
    const doCollapse = () => {
        setCollapse(!collapse);
    };

    useEffect(() => {
        const fetchQuestionInfo = async () => {
            if (!collapse) {
                const res = await axios.get(
                    `https://api.stackexchange.com/2.2/questions/${props.question_id}/comments?order=desc&sort=votes&site=stackoverflow&filter=!--1nZy2NR-_*`
                );
                res.data.items.sort((a, b) =>
                    a.creation_date <= b.creation_date ? 1 : -1
                );
                setThread(res.data.items);
            }
        };
        fetchQuestionInfo();
    }, [props, collapse]);

    return (
        <Card onClick={doCollapse}>
            <CardContent>
                <Typography color="textSecondary" className={classes.provider}>
                    {new Date(props.creation_date * 1000).toLocaleString()}
                </Typography>
                <Typography variant="h5">{decodeHTML(props.title)}</Typography>
                <Typography
                    className={
                        classes.date
                    }>{`votes: ${props.votes}`}</Typography>
            </CardContent>
            <Card variant="outlined">
                {!collapse
                    ? thread.map((comment, i) => {
                          return (
                              <CardContent key={i}>
                                  <Typography color="textSecondary">
                                      {new Date(
                                          comment.creation_date * 1000
                                      ).toLocaleString()}
                                  </Typography>
                                  <Typography variant="subtitle1">
                                      {decodeHTML(comment.body)}
                                  </Typography>
                              </CardContent>
                          );
                      })
                    : null}
            </Card>
        </Card>
    );
};

export default PostCard;
