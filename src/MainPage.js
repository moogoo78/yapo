const fs = require('fs');

import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import {FolderContainer} from './FolderContainer';
import { runPython } from './Utils';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
      <div
    role="tabpanel"
    hidden={value !== index}
    id={`simple-tabpanel-${index}`}
    aria-labelledby={`simple-tab-${index}`}
    {...other}
      >
      {value === index && (
          <Box p={3}>
          {children}
          </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function MainPage() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [setting, setSetting] = React.useState({
    ini: 'camera-trap-desktop.ini',
    section: {},
    isLoaded: false,
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function loadSetting() {
    setSetting(ps=> ({...ps, isLoaded: false}));
    runPython('setting.py', ['-i', setting.ini, '-x', 'load', '-s',], (err, results) => {
      if (err) throw err;
      const res = JSON.parse(results);
      console.log('[main] load setting', res);
      setSetting(ps=> ({
        ...ps,
        section:res.section,
        isLoaded: true
      }));
    });
  }

  if (!fs.existsSync(setting.ini)) {
    fs.copyFileSync(`${setting.ini}.sample`, setting.ini);
    console.log('copy init setting');
  }

  useEffect(() => {
    loadSetting();
    //initDB(settings);
  }, []);

  if (setting.isLoaded) {
    return (
        <div className={classes.root}>
        <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
        <Tab label="Folder" {...a11yProps(0)} />
        <Tab label="Album" {...a11yProps(1)} />
        <Tab label="Map" {...a11yProps(2)} />
        </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
        <FolderContainer setting={setting} loadSetting={loadSetting}/>
        </TabPanel>
        <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
        <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
        </div>
    );
  } else {
    return <div>loading ...</div>
  }
}

