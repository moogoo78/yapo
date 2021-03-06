import React, {useState, useContext} from 'react';

import { useStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
//import TreeItem from '@material-ui/lab/TreeItem';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';

import { Button } from '@material-ui/core';

import { SettingContext } from '../MainPage';

export function FolderMenu(props) {

  const {menuClick, folderList, menuAdd, menuWorking, dirStats} = props;

  const setting = useContext(SettingContext);
  //console.log(setting);
  return (
      <List component="nav">
      {folderList.map((v, i) => (
          <ListItem key={i}>
        <ListItemAvatar onClick={(e) => dirStats(e, i)}>
        <Avatar>
          <ImageIcon />
        </Avatar>
        </ListItemAvatar>
          <ListItemText primary={v.label} secondary={v.path} onClick={(e) => dirStats(e, i)}/>
          {/*<Button variant="outlined" size="small">刪除</Button>*/}
        </ListItem>
      ))}
      <ListItem>
      <Button
    variant="contained"
    component="label"
      >
      + 選擇照片目錄
      <input
    type="file"
    directory="true"
    webkitdirectory="true"
    hidden
    onChange={menuAdd}
      />
      </Button></ListItem>
    </List>
  )
}
