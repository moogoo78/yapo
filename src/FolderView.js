import React, { useState } from 'react';

//import {FolderList, NestedList, NestedFolderList, FileSystemNavigator} from './DirList';

const fs = require('fs');

import { VolumeMenu } from './VolumeMenu';
import { VolumeItemTable } from './VolumeItemTable';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    //textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export function FolderView() {
  const [nodeList, setNodeList] = React.useState([]);

  const classes = useStyles();
  const defaultVolume = [{
    type: 'path',
    name: 'D:\\foto'
  },{
    type: 'copy',
    name: 'volume'
  }];

  async function scanDir(path) {
    const rows = [];
    const dir = await fs.promises.opendir(path);
    for await (const dirent of dir) {
      //console.log(dirent.name);
      rows.push(dirent.name);
    }
    setNodeList(rows);
  }

  function menuClick(e, index){
    //console.log(defaultVolume[index]);
    scanDir(defaultVolume[index].name).catch(console.error);
  }

  function nodeClick(e, path){
    const pathScan = `${defaultVolume[0].name}\\${path}`;
    console.log(pathScan);
    scanDir(pathScan).catch(console.error);
  }

  return (
      <div className={classes.root}>
      <Grid container spacing={0}>
      <Grid item xs={3}>
      <VolumeMenu defaultVolume={defaultVolume} menuClick={menuClick} />
      </Grid>
      <Grid item xs={9}>
      <Paper className={classes.paper}>
      <VolumeItemTable rows={nodeList} onClick={nodeClick} />
      </Paper>
      </Grid>
      </Grid>
      </div>
  );
}


