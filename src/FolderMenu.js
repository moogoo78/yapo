import React, {useState, useRef, useEffect} from 'react';

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

export function FolderMenu(props) {

  const {folderView, menuClick} = props;

  return (
      <List component="nav">
      {folderView.volumeList.map((v, i) => (
          <ListItem key={i} onClick={(e) => menuClick(e, i)}>
        <ListItemAvatar>
        <Avatar>
        <ImageIcon />
        </Avatar>
        </ListItemAvatar>
        <ListItemText primary={v.source} secondary={v.type} />
        </ListItem>
      ))}
    </List>
  )
}
