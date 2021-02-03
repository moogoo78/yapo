import React, { useState } from 'react';

const fs = require('fs');
const path = require('path');

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
  const {imgView, open, handleClose, handleNav, handleKey} = props;
  //console.log(props);
  let imgSrc = null;
  if (imgView.path) {
    const base64 = fs.readFileSync(imgView.path).toString('base64');
    imgSrc = `data:image/jpg;base64,${base64}`;
  }

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
        <DialogTitle id="alert-dialog-title">{imgView.path}</DialogTitle>
        <DialogContent>
        <Grid container spacing={0}>
        <Grid item xs={1}><ArrowBackIosIcon onClick={(e)=> handleNav(e, -1)}/></Grid>
        <Grid item xs={10}><img src={imgSrc} width="680" /></Grid>
        <Grid item xs={1}><ArrowForwardIosIcon onClick={(e) => handleNav(e, 1)}/></Grid>
        </Grid>
      <DialogContentText id="alert-dialog-description">
      {imgView.index} / {imgView.len}
        </DialogContentText>
      </DialogContent>
      <ImageAnnotator />
        <DialogActions>
              <Button onClick={handleClose} color="primary">
        Cancel
    </Button>
                    <Button onClick={handleClose} color="primary" autoFocus>
      Save
      </Button>
        </DialogActions>
      </Dialog>
      </div>
  );
}
