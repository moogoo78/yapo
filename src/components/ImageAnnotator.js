import React, { useState, useContext } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';

import { SettingContext } from '../MainPage';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function FormElement(props) {
  const {name, data, change, value} = props;

  if (data.type === 'select') {
    const options = data.choices.split('|').map( (opt, optIdx) => {
      const optList = opt.split(':');
      const optValue = optList.length > 1 ? optList[1] : optList[0];
      const optLabel = optList[0];
      //console.log(optValue, optList, formValues[name]);
      return (<MenuItem value={optValue} key={optIdx}>{optLabel}</MenuItem>)
    });

    return (
        <React.Fragment>
        <InputLabel id={"annotation-"+name+"-label"}>{data.label}</InputLabel>
        <Select
      labelId={"annotation-"+name+"-label"}
      id={"annotation-"+name}
      onChange={(e) => change(e, name)}
      value={value}
      name={name}
        >
        <MenuItem value="" key={0}>--</MenuItem>
        {options}
      </Select>
        </React.Fragment>
    )
  } else if (data.type === 'text') {
    return (
        <TextField id={"annotation"+name} label={data.label} value={value} name={name} onChange={change}/>
    )
  }
}

export function ImageAnnotator(props) {
  const classes = useStyles();
  const setting = useContext(SettingContext);
  const fields = [];
  const vals = {};
  for (let i in setting.section) {
    if (i.startsWith('AnnotationField')) {
      const name = i.replace('AnnotationField', '').toLowerCase();
      fields.push([name, setting.section[i]]);
      vals[name] = '';
    }
  }
  const [formValues, setFormValues] = React.useState(vals);

    const handleChange = (event) => {
    console.log(event.target.value);
    setFormValues(ps => ({
      ...ps,
      [event.target.name]: event.target.value
    }));
  }

  console.log(formValues);

  return (
    <React.Fragment>
    {fields.map((v, i) => (
        <FormControl className={classes.formControl} key={i}>
        <FormElement data={v[1]} name={v[0]} change={handleChange} value={formValues[v[0]]}/>
        </FormControl>
    ))}
    </React.Fragment>
  )
}
