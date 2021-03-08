import React, { useState, useEffect } from 'react';
import { makeStyles, TextField, Button } from '@material-ui/core';
import useForm from './hooks/useForm';
import PostCard from './components/postCard';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
    footer: {
        'text-align': 'center',
        'white-space': 'nowrap',
        bottom: '0px',
    },
    listContainer: {
        width: '100%',
        height: '85%',
    },
    container: {
        height: '15%',
        width: '25%',
        display: 'flex',
        'align-items': 'center',
        margin: 'auto',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '200',
    },
}));

const App = () => {
    const classes = useStyles();
    const [errors, setErrors] = useState({});
    const [results, setResults] = useState([]);

    const [valid, setValid] = useState(false);
    const [responseTime, setResponseTime] = useState(0);

    const [form, onFormChange] = useForm({
        value: '',
    });
    //constant requests:
    //by creation date
    const creationReq = value => {
        return axios.get(
            `https://api.stackexchange.com/2.2/questions?pagesize=10&order=desc&sort=creation&tagged=${value}&site=stackoverflow`
        );
    };
    //by votes
    const votesReq = value => {
        return axios.get(
            `https://api.stackexchange.com/2.2/questions?pagesize=10&order=desc&sort=votes&tagged=${value}&site=stackoverflow`
        );
    };
    const validateForm = () => {
        let errors = {};
        if (!form.value) {
            errors.value = 'value is required';
        }
        setErrors(errors);
        setValid(Object.getOwnPropertyNames(errors).length === 0);
    };

    useEffect(() => {
        const getStackOverflowValues = () => {
            if (valid) {
                let startTime = Date.now();
                axios
                    .all([votesReq(form.value), creationReq(form.value)])
                    .then(responses => {
                        let queryResults = [
                            ...responses[0].data.items,
                            ...responses[1].data.items,
                        ];
                        queryResults.sort((a, b) =>
                            a.creation_date <= b.creation_date ? 1 : -1
                        );
                        setResponseTime(Date.now() - startTime);
                        setResults(queryResults);
                    });
            }
        };
        getStackOverflowValues();
    }, [valid, form]);
    return (
        <div className={classes.root}>
            <form
                className={classes.container}
                onSubmit={e => {
                    e.preventDefault();
                }}
                noValidate>
                <TextField
                    id="outlined-basic"
                    label="Stack Overflow Search"
                    variant="outlined"
                    name="value"
                    value={form.value}
                    onChange={onFormChange}
                    error={errors.value}
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <Button onClick={validateForm}>SEARCH</Button>
            </form>
            <div className={classes.listContainer}>
                {results
                    ? results.map((item, i) => {
                          return (
                              <PostCard
                                  key={i}
                                  question_id={item.question_id}
                                  title={item.title}
                                  creation_date={item.creation_date}
                                  votes={item.score}></PostCard>
                          );
                      })
                    : null}
            </div>
            <div className={classes.footer}>
                <p> {`Response Time: ${responseTime}ms`}</p>
                <p> {'COMP4350 Assignment 1 ––– Arvind Maan 7832526'} </p>
            </div>
        </div>
    );
};

export default App;
