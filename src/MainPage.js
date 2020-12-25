import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import {FolderContainer} from './FolderContainer';


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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
      <FolderContainer />
    </TabPanel>
      <TabPanel value={value} index={1}>
      Item Two
    </TabPanel>
      <TabPanel value={value} index={2}>
      Item Three
    </TabPanel>
      </div>
  );
}


/*
import { Container } from '@material-ui/core';
import Button from '@material-ui/core/Button';

import {FolderList, NestedList, NestedFolderList, FileSystemNavigator} from './DirList';

const fs = require('fs');


const App = () => {
  const [dirList, setDirList] = useState([]);

  function kashmir(e) {
    async function print(path) {
      const dir = await fs.promises.opendir(path);
      for await (const dirent of dir) {
        console.log(dirent.name);
      }
    }

    print('d:\\foto').catch(console.error);
  }

  function candyTalking(e) {
    e.preventDefault();
    console.log('The link was clicked2.');


    var python = require('child_process').spawn('python', ['./py/walk.py', 'volume']);
    python.stdout.on('data', function (data) {
      //console.log("Python response: ", data.toString('utf8'));
      setDirList(data.toString('utf8').split('x-x'));
      //result.textContent = data.toString('utf8');
    });

    python.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    python.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });
  }

  return (
    <div>
    <h1>
      Hi from a react app
    </h1>
      <Button variant="contained" onClick={candyTalking}>scandir</Button>
      <span onClick={kashmir}>kash</span>
      <input directory="" webkitdirectory="" id="myInput" type="file"></input>
      <FileSystemNavigator />
      </div>
  )
}

*/
