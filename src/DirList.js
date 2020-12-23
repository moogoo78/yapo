import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';


import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import WorkIcon from '@material-ui/icons/Work';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export function NestedList() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
      <List
    component="nav"
    aria-labelledby="nested-list-subheader"
    subheader={
        <ListSubheader component="div" id="nested-list-subheader">
        Nested List Items
      </ListSubheader>
    }
    className={classes.root}
      >
      <ListItem button>
      <ListItemIcon>
      <SendIcon />
      </ListItemIcon>
      <ListItemText primary="Sent mail" />
      </ListItem>
      <ListItem button>
      <ListItemIcon>
      <DraftsIcon />
      </ListItemIcon>
      <ListItemText primary="Drafts" />
      </ListItem>
      <ListItem button onClick={handleClick}>
      <ListItemIcon>
      <InboxIcon />
      </ListItemIcon>
      <ListItemText primary="Inbox" />
      {open ? <ExpandLess /> : <ExpandMore />}
    </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
      <ListItem button className={classes.nested}>
      <ListItemIcon>
      <StarBorder />
      </ListItemIcon>
      <ListItemText primary="Starred" />
      </ListItem>
      </List>
      </Collapse>
      </List>
  );
}

export function FolderList() {
  const classes = useStyles();

  return (
      <List className={classes.root}>
      <ListItem>
      <ListItemAvatar>
      <Avatar>
      <ImageIcon />
      </Avatar>
      </ListItemAvatar>
      <ListItemText primary="Photos" secondary="Jan 9, 2014" />
      </ListItem>
      <ListItem>
      <ListItemAvatar>
      <Avatar>
      <WorkIcon />
      </Avatar>
      </ListItemAvatar>
      <ListItemText primary="Work" secondary="Jan 7, 2014" />
      </ListItem>
      <ListItem>
      <ListItemAvatar>
      <Avatar>
      <BeachAccessIcon />
      </Avatar>
      </ListItemAvatar>
      <ListItemText primary="Vacation" secondary="July 20, 2014" />
      </ListItem>
      </List>
  );
}

export function NestedFolderList(props) {
  const classes = useStyles();
  const {dirList} = props;
  console.log(dirList,'render');
  return (
      <List className={classes.root}>
      {dirList.map((item, key) => (
          <ListItem key={key}>
          <ListItemAvatar>
          <Avatar>
          <ImageIcon />
          </Avatar>
          </ListItemAvatar>
          <ListItemText primary={item} secondary="Jan 9, 2014" />
          </ListItem>)
                  )}
    </List>
  );
}
