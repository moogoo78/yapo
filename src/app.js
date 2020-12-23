import React, { useState } from 'react';
import ReactDom from 'react-dom';

import { Container } from '@material-ui/core';
import Button from '@material-ui/core/Button';

import {FolderList, NestedList, NestedFolderList} from './DirList';

const fs = require('fs');

const mainElement = document.createElement('div');
document.body.appendChild(mainElement);


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
      <NestedFolderList dirList={dirList} />
      </div>
  )
}

ReactDom.render(<App />, mainElement);
