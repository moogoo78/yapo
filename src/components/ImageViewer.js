const fs = require('fs');

import React, { useState, useEffect } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Grid from '@material-ui/core/Grid';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

import {ImageAnnotator} from './ImageAnnotator';


export function ImageViewer(props) {
  const {data, open, handleClose, handleNav, handleKey, handleSave} = props;
  //console.log(props);
  let imgSrc = null;

  const index = data.imageIndex + 1;
  const total = data.imageList.length;
  const path = data.imageIndex >= 0 ? data.imageList[data.imageIndex][0] : '';

  const [annotationList, setAnnotationList] = useState(null);
  const [editKeyValue, setEditKeyValue] = useState('');

  useEffect(() => {
    //console.log('init',  data.annotationList[data.imageIndex]);
    setAnnotationList(data.annotationList);
  }, [props.data]);

  if (path) {
    const base64 = fs.readFileSync(path).toString('base64');
    imgSrc = `data:image/jpg;base64,${base64}`;
  }

  function handleAnnotationChange(e) {
    //console.log('annotation change: ', e.target.name, e.target.value);
    setAnnotationList(ps => {
      ps[data.imageIndex][e.target.name] = e.target.value;
      return (ps)
    });
    setEditKeyValue(`${e.target.name}=${e.target.value}`); // let ImageAnnotator can return update value
  }
  //console.log(annotationList);
  return (
      <div onKeyDown={handleKey}>
      <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="lg"
      scroll="body"
      disableBackdropClick={true}
        >
      <DialogTitle id="alert-dialog-title">{path}</DialogTitle>
        <DialogContent>
        <Grid container spacing={0}>
        <Grid item xs={1}><ArrowBackIosIcon onClick={(e)=> handleNav(e, -1)}/></Grid>
        <Grid item xs={10}><img src={imgSrc} width="680" /></Grid>
        <Grid item xs={1}><ArrowForwardIosIcon onClick={(e) => handleNav(e, 1)}/></Grid>
        </Grid>
      <DialogContentText id="alert-dialog-description">
      { index } / {total}
        </DialogContentText>
      </DialogContent>
      <ImageAnnotator values={annotationList} change={handleAnnotationChange} imageIndex={data.imageIndex} edit={editKeyValue} />
        <DialogActions>
      <Button onClick={handleClose} color="primary">
        Cancel
    </Button>
      <Button onClick={(e)=>handleSave(e, annotationList)} color="primary" autoFocus>
      Save
      </Button>
        </DialogActions>
      </Dialog>
      </div>
  );
}
