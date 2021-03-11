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
    thread: {
        'margin-left': '50px',
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
    const [qbody, setQbody] = useState('');

    const doCollapse = () => {
        setCollapse(!collapse);
    };

    useEffect(() => {
        const fetchQuestionInfo = async () => {
            if (!collapse) {
                const res = await axios.get(
                    `https://api.stackexchange.com/2.2/questions/${props.question_id}?order=desc&sort=votes&site=stackoverflow&filter=!)rTkraPYPWw39)()ir25`
                );
                console.log(res);
                let thread = [];
                const question = res.data.items[0];

                if (question.hasOwnProperty('answers'))
                    thread = thread.concat(question.answers);
                if (question.hasOwnProperty('comments'))
                    thread = thread.concat(question.comments);
                thread.sort((a, b) =>
                    a.creation_date <= b.creation_date ? 1 : -1
                );
                setQbody(decodeHTML(question.body_markdown));
                setThread(thread);
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
                <Typography>{!collapse ? qbody : null}</Typography>
                <Typography
                    className={
                        classes.date
                    }>{`votes: ${props.votes}`}</Typography>
            </CardContent>

            <Card>
                {!collapse
                    ? thread.map((comment, i) => {
                          let subcomments = null;
                          if (comment.hasOwnProperty('comments')) {
                              subcomments = comment.comments;
                              subcomments.sort((a, b) =>
                                  a.creation_date <= b.creation_date ? 1 : -1
                              );
                          }

                          return (
                              <Card
                                  variant="outlined"
                                  className={classes.thread}
                                  key={i}>
                                  <CardContent>
                                      <Typography color="textSecondary">
                                          {new Date(
                                              comment.creation_date * 1000
                                          ).toLocaleString()}
                                      </Typography>
                                      <Typography variant="subtitle1">
                                          {decodeHTML(comment.body_markdown)}
                                      </Typography>
                                      <Typography
                                          variant="caption"
                                          className={
                                              classes.date
                                          }>{`votes: ${props.votes}`}</Typography>
                                  </CardContent>
                                  {subcomments
                                      ? subcomments.map((subcomment, i) => {
                                            return (
                                                <Card
                                                    variant="outlined"
                                                    className={classes.thread}
                                                    key={i}>
                                                    <CardContent>
                                                        <Typography color="textSecondary">
                                                            {new Date(
                                                                subcomment.creation_date *
                                                                    1000
                                                            ).toLocaleString()}
                                                        </Typography>
                                                        <Typography variant="subtitle1">
                                                            {decodeHTML(
                                                                subcomment.body_markdown
                                                            )}
                                                        </Typography>
                                                        <Typography
                                                            variant="caption"
                                                            className={
                                                                subcomment.date
                                                            }>{`votes: ${subcomment.votes}`}</Typography>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })
                                      : null}
                              </Card>
                          );
                      })
                    : null}
            </Card>
        </Card>
    );
};

export default PostCard;
