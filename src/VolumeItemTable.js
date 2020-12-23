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

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export function VolumeItemTable(props) {
  const classes = useStyles();
  const {rows, onClick} = props;
  //console.log(rows, 'uu');
  return (
      <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
      <TableHead>
      <TableRow>
      <TableCell>name</TableCell>
      <TableCell align="right">last modified</TableCell>
      <TableCell align="right">type</TableCell>
      <TableCell align="right">size</TableCell>
      </TableRow>
      </TableHead>
      <TableBody>
      {rows.map((v, i) => (
          <TableRow key={i} hover onClick={(e) => onClick(e, v)}>
          <TableCell component="th" scope="row">{v}</TableCell>
          <TableCell align="right"></TableCell>
          <TableCell align="right"></TableCell>
          <TableCell align="right"></TableCell>
          </TableRow>
      ))}
      </TableBody>
      </Table>
      </TableContainer>
  );
}
