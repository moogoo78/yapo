import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export function ImageAnnotator(props) {
  const classes = useStyles();
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };
  return (
    <React.Fragment>
      <FormControl className={classes.formControl}>
      <InputLabel id="annotation-species-label">Species</InputLabel>
      <Select
    labelId="annotation-species-label"
    id="annotation-species"
    onChange={handleChange}
    value={age}
      >
      <MenuItem value={10}>Ten</MenuItem>
      <MenuItem value={20}>Twenty</MenuItem>
      <MenuItem value={30}>Thirty</MenuItem>
      </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
      <InputLabel id="annotation-age-label">Age</InputLabel>
      <Select
    labelId="annotation-age-label"
    id="annotation-age"
    onChange={handleChange}
    value={age}
      >
      <MenuItem value={10}>Ten</MenuItem>
      <MenuItem value={20}>Twenty</MenuItem>
      <MenuItem value={30}>Thirty</MenuItem>
      </Select>
      </FormControl>
      </React.Fragment>
  )
}
