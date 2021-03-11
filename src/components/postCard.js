import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import { Card, CardContent, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    date: {
        marginBottom: 12,
    },
    provider: {
        fontSize: 14,
    },
    comments: {
        'background-color': '#e6e5e7',
        'margin-left': '75px',
    },
    answers: {
        'margin-left': '25px',
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
    const [answers, setAnswers] = useState([]);
    const [comments, setComments] = useState([]);

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
                const question = res.data.items[0];

                if (question.answers)
                    question.answers.sort((a, b) =>
                        a.creation_date <= b.creation_date ? 1 : -1
                    );
                if (question.comments)
                    question.comments.sort((a, b) =>
                        a.creation_date <= b.creation_date ? 1 : -1
                    );
                setQbody(decodeHTML(question.body_markdown));
                setAnswers(question.answers ? question.answers : []);
                setComments(question.comments ? question.comments : []);
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
                <ReactMarkdown>{!collapse ? qbody : null}</ReactMarkdown>
                <Typography
                    className={
                        classes.date
                    }>{`votes: ${props.votes}`}</Typography>
            </CardContent>

            <Card>
                {!collapse
                    ? comments.map((comment, i) => {
                          return (
                              <Card
                                  variant="outlined"
                                  className={classes.comments}
                                  key={i}>
                                  <CardContent>
                                      <Typography color="textSecondary">
                                          {new Date(
                                              comment.creation_date * 1000
                                          ).toLocaleString()}
                                      </Typography>
                                      <ReactMarkdown>
                                          {decodeHTML(comment.body_markdown)}
                                      </ReactMarkdown>
                                      <Typography
                                          variant="caption"
                                          className={
                                              classes.date
                                          }>{`votes: ${comment.score}`}</Typography>
                                  </CardContent>
                              </Card>
                          );
                      })
                    : null}
            </Card>
            <Card>
                {!collapse
                    ? answers.map((comment, i) => {
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
                                  className={classes.answers}
                                  key={i}>
                                  <CardContent>
                                      <Typography color="textSecondary">
                                          {new Date(
                                              comment.creation_date * 1000
                                          ).toLocaleString()}
                                      </Typography>
                                      <ReactMarkdown>
                                          {decodeHTML(comment.body_markdown)}
                                      </ReactMarkdown>
                                      <Typography
                                          variant="caption"
                                          className={
                                              classes.date
                                          }>{`votes: ${comment.score}`}</Typography>
                                  </CardContent>
                                  {subcomments
                                      ? subcomments.map((subcomment, i) => {
                                            return (
                                                <Card
                                                    variant="outlined"
                                                    className={classes.comments}
                                                    key={i}>
                                                    <CardContent>
                                                        <Typography color="textSecondary">
                                                            {new Date(
                                                                subcomment.creation_date *
                                                                    1000
                                                            ).toLocaleString()}
                                                        </Typography>
                                                        <ReactMarkdown>
                                                            {decodeHTML(
                                                                subcomment.body_markdown
                                                            )}
                                                        </ReactMarkdown>
                                                        <Typography
                                                            variant="caption"
                                                            className={
                                                                subcomment.date
                                                            }>{`votes: ${subcomment.score}`}</Typography>
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
