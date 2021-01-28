const fs = require('fs');
const path = require('path');

import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';


import { FolderMenu } from './components/FolderMenu';
import { FolderNodeList } from './components/FolderNodeList';
import { FolderBreadcrumb } from './components/FolderBreadcrumb';
import { ImageViewer } from './components/ImageViewer';


function checkImage(imgPath) {
  const p = path.parse(imgPath);
  if (['.JPG', '.JPEG', '.PNG'].indexOf(p.ext.toUpperCase()) >= 0) {
    return true;
    // TODO*/
  }
  return false;
}

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

  //journey: new Array(defaultVolume.length), // TODO: memorize path for each volume

  const [folderView, setFolderView] = React.useState({
    nodeList: [],
    imageList: [],
    imageIndex: -1,
    dirPath: '',
  });
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  /* TODO config Future save in setting file or database */
  const defaultVolumeList = [{
    type: 'mount',
    source: 'D:\\',
  },{
    type: 'copy',
    source: 'volume',
  }];

  const classes = useStyles();

  async function scanDir(path) {
    const rows = [];
    const dir = await fs.promises.opendir(path);
    for await (const dirent of dir) {
      //console.log(dirent, dirent.isDirectory());
      rows.push(dirent);
    }
    return rows;
  }


  function refresh(dirPath) {

    scanDir(dirPath).then((rows) => {
      const imgList = [];
      for (let i in rows) {
        if (!rows[i].isDirectory() &&
            checkImage([dirPath, rows[i].name].join(path.sep))) {
          imgList.push(rows[i]);
        }
      }

      setFolderView(ps => ({
        ...ps,
        dirPath: dirPath,
        nodeList: rows,
        imageList: imgList,
        imageIndex: -1,
      }));
    }).catch(console.error);
  }

  function handleMenuClick(e, index) {
    console.log('click menu volume:', index);
    const dirPath = defaultVolumeList[index].source; // reset path
    refresh(dirPath);
  }

  function handleImageNavClick(e, direction) {
    console.log('click image nav click:', direction);
    console.log(folderView.imageList.length, folderView.imageIndex);
    //console.log(folderView);
    let inc = folderView.imageIndex;
    if (direction === 1) {
      if (inc < folderView.imageList.length - 1) {
        inc++;
      }
    }
    else if (direction === -1){
      if (inc > 0) {
        inc--;
      }
    }

    setFolderView(ps => ({
      ...ps,
      imageIndex: inc,
    }));
  }

  function handleBreadcrumbClick(e, breadcrumbIndex) {
    e.preventDefault();
    console.info('You clicked a breadcrumb.', breadcrumbIndex);
    let dirList = folderView.dirPath.split(path.sep);
    const newDirList = dirList.slice(0, breadcrumbIndex+1);
    refresh(newDirList.join(path.sep));
  }

  function handleNodeClick(e, index, row){
    const newPath = path.join(folderView.dirPath, row.name);
    //console.log(index, row);
    if (row.isDirectory()) {
      refresh(newPath);
    } else if (checkImage(newPath)){
      console.log('click image', newPath, index);
      // TODO: find index
      setImageDialogOpen(true);
      setFolderView(ps => ({
        ...ps,
        imageIndex: index,
      }));
    }
  }

  console.log('folderView: ', folderView);

  let imgPath = '';
  if (folderView.imageList && folderView.imageIndex > -1) {
    imgPath = [
      folderView.dirPath,
      folderView.imageList[folderView.imageIndex].name
    ].join(path.sep);
  }

  return (
      <div className={classes.root}>
      <Grid container spacing={0}>
      <Grid item xs={3}>
      <FolderMenu menuClick={handleMenuClick} volumeList={defaultVolumeList}/>
      </Grid>
      <Grid item xs={9}>
      {<FolderBreadcrumb dirList={folderView.dirPath ? folderView.dirPath.split(path.sep) : []} breadcrumbClick={handleBreadcrumbClick} />}
      <Paper className={classes.paper}>
      {imgPath ? <ImageViewer imgPath={imgPath} open={imageDialogOpen} handleClose={(e)=> setImageDialogOpen(false)} handleNav={handleImageNavClick}/> : null}
      <FolderNodeList nodeClick={handleNodeClick} nodeList={folderView.nodeList} />
      </Paper>
      </Grid>
      </Grid>
      </div>
  );
}
