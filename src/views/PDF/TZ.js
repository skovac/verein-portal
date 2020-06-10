import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Grid,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText
} from '@material-ui/core';
import { SkipPrevious, SkipNext } from '@material-ui/icons';
import { Document, Page, pdfjs } from 'react-pdf';

import backendURL from '../../BackendUrl';
import { getTzNbs } from '../../backend-calls/TZ';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

export const TeutonenZeitung = () => {
  const classes = useStyles();

  const [ tzNb, setTzNb ] = useState(539);
  const [ tzList, setTzList ] = useState([]);
  useEffect(() => getTzNbs(setTzList), []);

  const [numPages, setNumPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const validPage = () => {
    if (pageNumber < numPages && pageNumber > 0) {
      return pageNumber;
    } else if (pageNumber < 1) {
      return 1;
    } else if (pageNumber >= numPages) {
      return numPages;
    }
  }

  /* really ugly hack but this way i don't have to deal with displaying the right pages
   * once the user went all the way to the end of the document and click on the previous button.
   */
  if (pageNumber % 2 === 0 && pageNumber !== numPages) {
    setPageNumber(pageNumber + 1);
  }

  return (
    <div style={{maxHeight: '100%', overflow: 'auto'}}>
      <Box m={2} component="div" overflow="hidden" style={{zoom: 0.90, float: 'left'}}>
        <Document
          file={backendURL + "/tz?tzNb=" + tzNb}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Grid container spacing={1}>
            <Grid item>
              {pageNumber > 1 && (pageNumber < numPages || (numPages % 2 === 1)) ? <Page pageNumber={validPage() - 1} /> : <></>}
            </Grid>
            <Grid item>
              <Page pageNumber={validPage()}/>
            </Grid>
          </Grid>
        </Document>

        <IconButton onClick={() => setPageNumber(pageNumber > 1 ? pageNumber - 2 : pageNumber)}>
          <SkipPrevious/>
        </IconButton>
        <IconButton onClick={() => setPageNumber(pageNumber < (numPages - 1) ? pageNumber + 2 : numPages)}>
          <SkipNext/>
        </IconButton>
        <Typography variant="caption">
          Seite {(pageNumber - 1) && (pageNumber !== numPages || numPages % 2 === 1) ? (pageNumber - 1) + "," : ""}{pageNumber} / {numPages}
        </Typography>
      </Box>

      <Box m={2} style={{ maxHeight: 400, overflow: 'auto', float: 'right' }} >
        <List className={classes.root} subheader={<li />} >
          {tzList.map((num) => (
            <ListItem key={num} button onClick={() => { 
              console.log(num);
              setTzNb(num);
              setPageNumber(1);
            }}
            >
              <ListItemText primary={"Teutonenzeitung n°" + num} />
            </ListItem>
          ))}
        </List>
      </Box>
    </div>
  );
}
