import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

export function FolderBreadcrumb(props) {
  const classes = useStyles();
  //console.log(props);
  const {dirList, breadcrumbClick} = props;

  return (
      <div className={classes.root}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
      {dirList.map((v,i) =>
                          (i < dirList.length - 1
                           ? (<Link key={i} color="inherit" href="/" onClick={(e) => breadcrumbClick(e, i)}>{v}</Link>)
                           : (<Typography key={i} color="textPrimary">{v}</Typography>)))}
    </Breadcrumbs>
      </div>
  );
}
