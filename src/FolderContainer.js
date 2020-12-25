const fs = require('fs');

import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import { FolderMenu } from './FolderMenu';
import { FolderNodeList } from './FolderNodeList';
import { FolderBreadcrumb } from './FolderBreadcrumb';

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

export function FolderContainer() {
  //const [nodeList, setNodeList] = React.useState([]);
  //const [currentVolumeIndex, setCurrentVolumeIndex] = React.useState(0);
  //const [breadcrumbList, setBreadcrumbList] = React.useState([]);
  /* config Future save in setting file or database */
  const defaultVolume = [{
    type: 'mount',
    source: 'D:\\',
  },{
    type: 'copy',
    source: 'volume',
  }];


  const [folderView, setFolderView] = React.useState({
    volumeIndex: 0,
    volumeList: defaultVolume,
    nodeList: [],
    path: '',
    //journey: new Array(defaultVolume.length), // TODO: memorize path for each volume
  });
  const [nodeList, setNodeList] = React.useState([]);

  // init
  //folderView.journey[0] = 'foto';
  //setFolderView(folderView);

  const classes = useStyles();

  async function scanDir(path) {
    const rows = [];
    const dir = await fs.promises.opendir(path);
    for await (const dirent of dir) {
      //console.log(dirent, dirent.isDirectory());
      rows.push([dirent.name, dirent.isDirectory()]);
    }
    return rows;
  }


  function refresh(path) {
    scanDir(path).then((rows) => {
      setFolderView(ps => ({
        ...ps,
        nodeList: rows,
        path: path,
      }));
    }).catch(console.error);
  }
  function handleMenuClick(e, index) {
    console.log('click menu volume:', index);
    const path = folderView.volumeList[index].source; // reset path
    refresh(path);
  }

  function handleBreadcrumbClick(e, breadcrumbIndex) {
    e.preventDefault();
    console.info('You clicked a breadcrumb.', breadcrumbIndex);
    //console.log(breadcrumbList, breadcrumbList.slice(0, breadcrumbIndex + 1));
    //setBreadcrumbList(breadcrumbList.slice(0, breadcrumbIndex + 1));
  }

  function handleNodeClick(e, row){
    const path = row[0];
    const isDir = row[1];
    if (isDir === true) {
      const newPath = `${folderView.path}\\${path}`;
      refresh(newPath);
    } else {
      console.log('click file');
    }
  }

  console.log('folderView: ', folderView);

  return (
      <div className={classes.root}>
      <Grid container spacing={0}>
      <Grid item xs={3}>
      <FolderMenu menuClick={handleMenuClick} folderView={folderView} />
      </Grid>
      <Grid item xs={9}>
      <FolderBreadcrumb folderView={folderView} breadcrumbClick={handleBreadcrumbClick} />
      <Paper className={classes.paper}>
      <FolderNodeList nodeClick={handleNodeClick} folderView={folderView} />
      </Paper>
      </Grid>
      </Grid>
      </div>
  );
}
