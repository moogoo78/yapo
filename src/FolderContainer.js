const fs = require('fs');
const path = require('path');
const os = require('os');

import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import { FolderMenu } from './components/FolderMenu';
import { FolderNodeList } from './components/FolderNodeList';
import { FolderBreadcrumb } from './components/FolderBreadcrumb';
import { ImageViewer } from './components/ImageViewer';
import {saveSetting} from './Utils';


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
    folderList: [],
    dirPath: '',
  });
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  const classes = useStyles();

  async function scanDir(path) {
    const rows = [];
    const dir = await fs.promises.opendir(path);
    for await (const dirent of dir) {
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
          imgList.push(rows[i].name);
        }
      }
      // TODO: sort by mtime
      const sorted = imgList.sort();

      setFolderView(ps => ({
        ...ps,
        dirPath: dirPath,
        nodeList: rows,
        imageList: sorted,
        imageIndex: -1,
      }));
    }).catch(console.error);
  }


  function handleMenuAdd(e) {
    if (e.target.files.length) {
      const newPath = path.dirname(e.target.files[0].path);
      const folderName = newPath.split(path.sep).pop();

      setFolderView(ps => {
        const newList = ps.folderList;
        newList.push({path: newPath, label: folderName});
        return ({
          ...ps,
          folderList: newList,
        })
      });
      refresh(newPath);
      saveSetting('folder_path', newPath);
    }
  }

  function handleMenuClick(e, index) {
    console.log('click menu volume:', index);
    const dirPath = folderView.folderList[index].path; // reset path
    refresh(dirPath);
  }


  function slideImage(direction) {
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
  function handleImageNavKey(e) {
    if (e.code === 'ArrowRight') {
      slideImage(1);
    } else if (e.code === 'ArrowLeft') {
      slideImage(-1);
    }
  }

  function handleImageNavClick(e, direction) {
    console.log('click image nav click:', direction);
    //console.log(folderView.imageList.length, folderView.imageIndex);
    //console.log(folderView);
    slideImage(direction);
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

  //console.log('folderView: ', folderView);

  let imgView = {
    path: '',
    len: 0,
    index: 0,
  }

  if (folderView.imageList && folderView.imageIndex > -1) {
    imgView = {
      path: [
        folderView.dirPath,
        folderView.imageList[folderView.imageIndex]
      ].join(path.sep),
      len: folderView.imageList.length,
      index: folderView.imageIndex + 1,
    }
  }

  return (
      <div className={classes.root}>
      <Grid container spacing={0}>
      <Grid item xs={3}>
      <FolderMenu menuClick={handleMenuClick} folderList={folderView.folderList} menuAdd={handleMenuAdd}/>
      </Grid>
      <Grid item xs={9}>
      {<FolderBreadcrumb dirList={folderView.dirPath ? folderView.dirPath.split(path.sep) : []} breadcrumbClick={handleBreadcrumbClick} />}
      <Paper className={classes.paper}>
      {imgView.path !== '' ? <ImageViewer imgView={imgView} open={imageDialogOpen} handleClose={(e)=> setImageDialogOpen(false)} handleNav={handleImageNavClick} handleKey={handleImageNavKey}/> : null}
      <FolderNodeList nodeClick={handleNodeClick} nodeList={folderView.nodeList} />
      </Paper>
      </Grid>
      </Grid>
      </div>
  );
}
