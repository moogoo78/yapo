import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
//import { useStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
}));


export function FolderNodeList(props) {
  const classes = useStyles();

  const {nodeList, nodeClick} = props;
  //console.log ('refresh nodelist', props);
  /* 🔴 🟢*/
  return (
      <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
      <TableHead>
      <TableRow>
      <TableCell>#</TableCell>
      <TableCell>狀態 ⚪:空白🟡:已標註 </TableCell>
      <TableCell>name</TableCell>
      <TableCell align="right">last modified</TableCell>
      </TableRow>
      </TableHead>
      <TableBody>
      {nodeList.map((v, i) => (
          <TableRow key={i} hover onClick={(e) => nodeClick(e, i, v)}>
          <TableCell component="th" scope="row">{i+1}</TableCell>
          <TableCell>{v[2] === "I" ? '⚪': '🟡'}</TableCell>
          <TableCell>{v[1]}</TableCell>
          <TableCell align="right"></TableCell>
          </TableRow>
      ))}
      </TableBody>
      </Table>
      </TableContainer>
  );
}
