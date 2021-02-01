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
    //setAge(event.target.value);
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
      <MenuItem value={10}>山羌</MenuItem>
      <MenuItem value={20}>水鹿</MenuItem>
      <MenuItem value={40}>山羊</MenuItem>
      <MenuItem value={30}>獼猴</MenuItem>
      <MenuItem value={30}>鳥；</MenuItem>
      </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
      <InputLabel id="annotation-age-label">年齡</InputLabel>
      <Select
    labelId="annotation-age-label"
    id="annotation-age"
    onChange={handleChange}
    value={age}
      >
      <MenuItem value={10}>10</MenuItem>
      <MenuItem value={20}>20</MenuItem>
      <MenuItem value={30}>30</MenuItem>
      </Select>
      </FormControl>

      <FormControl className={classes.formControl}>
      <InputLabel id="annotation-species-label">Species</InputLabel>
      <Select
    labelId="annotation-species-label"
    id="annotation-species"
    onChange={handleChange}
    value={""}
      >
      <MenuItem value={10}>山羌</MenuItem>
      <MenuItem value={20}>水鹿</MenuItem>
      <MenuItem value={40}>山羊</MenuItem>
      <MenuItem value={30}>獼猴</MenuItem>
      <MenuItem value={30}>鳥；</MenuItem>
      </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
      <InputLabel id="annotation-sex-label">性別</InputLabel>
      <Select
    labelId="annotation-sex-label"
    id="annotation-sex"
    onChange={handleChange}
    value={""}
      >
      <MenuItem value="">--</MenuItem>
      <MenuItem value="m">male</MenuItem>
      <MenuItem value="f">female</MenuItem>
      </Select>
      </FormControl>


      <FormControl className={classes.formControl}>
      <InputLabel id="annotation-a-label">角況</InputLabel>
      <Select
    labelId="annotation-a-label"
    id="annotation-a"
    onChange={handleChange}
    value={""}
      >
      <MenuItem value="">--</MenuItem>
      </Select>
      </FormControl>

          <FormControl className={classes.formControl}>
      <InputLabel id="annotation-b-label">隻數</InputLabel>
      <Select
    labelId="annotation-b-label"
    id="annotation-b"
    onChange={handleChange}
    value={""}
      >
      <MenuItem value="">--</MenuItem>
      </Select>
      </FormControl>

      <FormControl className={classes.formControl}>
      <InputLabel id="annotation-c-label">個體 ID</InputLabel>
      <Select
    labelId="annotation-c-label"
    id="annotation-c"
    onChange={handleChange}
    value={""}
      >
      <MenuItem value="">--</MenuItem>
      </Select>
      </FormControl>

      </React.Fragment>
  )
}
