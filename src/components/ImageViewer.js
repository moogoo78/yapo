import React, { useState } from 'react';

const fs = require('fs');

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Grid from '@material-ui/core/Grid';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

export function ImageViewer(props) {
  const {imgPath, open, handleClose, handleNav} = props;
  //console.log(props);
  let imgSrc = null;
  if (imgPath) {
    const base64 = fs.readFileSync(imgPath).toString('base64');
    imgSrc = `data:image/jpg;base64,${base64}`;
  }

  return (
      <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="lg"
      scroll="body"
      disableBackdropClick={true}
        >
        <DialogTitle id="alert-dialog-title">{"Image Viewer"}</DialogTitle>
        <DialogContent>
        <Grid container spacing={0}>
        <Grid item xs={1}><ArrowBackIosIcon onClick={(e)=> handleNav(e, -1)}/></Grid>
        <Grid item xs={10}><img src={imgSrc} width="680" /></Grid>
        <Grid item xs={1}><ArrowForwardIosIcon onClick={(e) => handleNav(e, 1)}/></Grid>
        </Grid>
        <DialogContentText id="alert-dialog-description">
        Let Google help apps determine location. This means sending anonymous location data to
      Google, even when no apps are running.
        </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button onClick={handleAnnotateClick}>
      Annotate
      </Button>
        <Button onClick={handleClose} color="primary" autoFocus>
        Close
      </Button>
        </DialogActions>
        </Dialog>
  );
}
