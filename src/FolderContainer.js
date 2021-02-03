const fs = require('fs');
const path = require('path');
const os = require('os');

import React, { useState, useEffect, useContext } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import { FolderMenu } from './components/FolderMenu';
import { FolderNodeList } from './components/FolderNodeList';
import { FolderBreadcrumb } from './components/FolderBreadcrumb';
import { ImageViewer } from './components/ImageViewer';
import { runPython } from './Utils';
import { SettingContext } from './MainPage';

import LinearProgress from '@material-ui/core/LinearProgress';

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

export function FolderContainer(props) {
  const {loadSetting} = props;
  const setting = useContext(SettingContext);
  //console.log(setting);

  const fdList = [];
  for (let i in setting.section.Folders) {
    fdList.push({
      label: i,
      path: setting.section.Folders[i],
    });
  }

  const [folderView, setFolderView] = React.useState({
    nodeList: [],
    imageList: [],
    imageIndex: -1,
    dirPath: '',
    annotationList: [],
    isLoaded: true,
  });
  const [folderList, setFolderList] = React.useState(fdList);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  //const [annotationList, setAnnotationList] = useState(null);

  useEffect(() => {
    // init
  }, []);

  const classes = useStyles();

  async function scanDir(path) {
    const rows = [];
    const dir = await fs.promises.opendir(path);
    for await (const dirent of dir) {
      if (dirent.name[0] !== '.') {
        rows.push(dirent);
      }
    }
    return rows;
  }


  function getDirStats(e, index) {
    const dbFile = setting.section.SQLite.dbfile;

    const dirPath = folderList[index].path; // reset path

    runPython(
      'dir-stats.py',
      ['-p', dirPath, '-s', '-d', dbFile],
      (err, results) => {
        if (err) throw err;
        const res = JSON.parse(results);
        console.log('results:' , res);

        const alist = res.results.map((x) => (x[5] ==="" ? {} : JSON.parse(x[5])));
        setFolderView(ps => ({
          ...ps,
          dirPath: dirPath,
          nodeList: res.results,
          imageList: res.results,
          imageIndex: -1,
          annotationList: alist,
          folderIndex: index
        }));

      });
  }

  function refresh(dirPath, startWorking=false) {
    /*
      by javascript (nodejs)
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
    */

    const dbFile = setting.section.SQLite.dbfile;
    const thumbDir = setting.section.Thumbnail.destination;

    //os.platform() win32
    //console.log(dirPath.split('\\').join('\\\\'));
    console.log('refresh', dirPath);
    //['-p', dirPath, '--db', dbFile, '--thumb', thumbDir, '-s']
    const args = startWorking ?
          ['-p', dirPath, '--db', dbFile, '-s']
          : ['-p', dirPath, '-s'];

    runPython(
      'scan-dir.py',
      args,
      (err, results) => {
        if (err) throw err;
        const res = JSON.parse(results);
        console.log('results:' , res);
        setFolderView(ps => ({
          ...ps,
          dirPath: dirPath,
          nodeList: res['node_list'],
          imageList: res['img_list'],
          imageIndex: -1,
          folderIndex: -1,
          isLoaded: true
        }));
      });
  }


  function handleMenuAdd(e) {
    if (e.target.files.length) {
      setFolderView(ps => ({...ps, isLoaded:false}));
      const newPath = path.dirname(e.target.files[0].path);
      const folderName = newPath.split(path.sep).pop();

      const dbFile = setting.section.SQLite.dbfile;
      const thumbDir = setting.section.Thumbnail.destination;

      runPython(
        'scan-dir.py',
        ['-p', newPath, '--db', dbFile, '-s'],
        (err, results) => {
          if (err) throw err;
          const res = JSON.parse(results);
          console.log('results:' , res);
          setFolderView(ps => ({...ps, isLoaded:true}));

                runPython('setting.py',
                ['-i', setting.ini, '-x', 'save', '-s', '-c', 'Folders', '-k', folderName, '-a', newPath],
                (err, results) => {
                  if (err) throw err;
                  //console.log('results:' , results);
                  loadSetting();
                });
        });
    }
  }

  function handleMenuClick(e, index) {
    console.log('click menu volume:', index);
    const dirPath = folderList[index].path; // reset path
    setFolderView(ps => ({...ps, isLoaded:false}));
    refresh(dirPath);
  }

  function handleMenuWorking(e, index) {
    console.log('click menu volume:', index);
    const dirPath = folderList[index].path; // reset path
    const folderName = folderList[index].label;

    setFolderView(ps => ({...ps, isLoaded:false}));
    refresh(dirPath, true);
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

  function handleSaveAnnotation(e, data) {
    setImageDialogOpen(false);
    //console.log('save', key, data);
    const dbFile = setting.section.SQLite.dbfile;
    //const jsData = JSON.stringify(data);
    const keyValues = folderView.imageList.map((x, xi) => ({
      key:x[4],
      value:data[xi]}));

    const jsData = JSON.stringify(keyValues);
    //const args = `-d ${dbFile} -s -x save -k ${key} -a ${jsData}`.split(' ');

    const args = `-d ${dbFile} -s -x save -b ${jsData}`.split(' ');
    console.log('save anno', data, jsData);

    runPython(
      'db-images.py',
      args,
      (err, results) => {
        if (err) throw err;
        const res = JSON.parse(results);
        console.log('save sqlite results:' , res);
        getDirStats(e, folderView.folderIndex);
      });
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
    const newPath = path.join(folderView.dirPath, row[0]);
    //console.log(index, row);
    //if (row[1]) {
    //  refresh(newPath);
    //} else if (checkImage(newPath)){
    //  console.log('click image', newPath, index);
    // TODO: find index
    setImageDialogOpen(true);
    setFolderView(ps => ({
      ...ps,
      imageIndex: index,
    }));
    //}
  }

  //console.log('folderView: ', folderView);

  let imgView = {
    path: '',
    len: 0,
    index: 0,
  }
  /*
  if (folderView.imageList && folderView.imageIndex > -1) {
    const alist = folderView.imageList.map((x) => (x[5] ==="" ? {} : JSON.parse(x[5])));
    imgView = {
      data: folderView.imageList[folderView.imageIndex],
      len: folderView.imageList.length,
      index: folderView.imageIndex + 1,
      alist: alist
    }
  }*/
  console.log('folderView:', folderView);

  return (
      <div className={classes.root}>
      <Grid container spacing={0}>
      <Grid item xs={3}>
      { folderView.isLoaded ?
        <FolderMenu menuClick={handleMenuClick} folderList={folderList} menuAdd={handleMenuAdd} menuWorking={handleMenuWorking} dirStats={getDirStats} /> : <div>🦌💨 loading images...</div> }
      </Grid>
      <Grid item xs={9}>
      {<FolderBreadcrumb dirList={folderView.dirPath ? folderView.dirPath.split(path.sep) : []} breadcrumbClick={handleBreadcrumbClick} />}
      <Paper className={classes.paper}>
      <ImageViewer data={folderView} open={imageDialogOpen} handleClose={(e)=> setImageDialogOpen(false)} handleNav={handleImageNavClick} handleKey={handleImageNavKey} handleSave={handleSaveAnnotation} />
    {folderView.isLoaded ? <FolderNodeList nodeClick={handleNodeClick} nodeList={folderView.nodeList} /> : <div><LinearProgress /></div> }
      </Paper>
      </Grid>
      </Grid>
      </div>
  );
}
