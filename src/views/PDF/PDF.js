import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText
} from '@material-ui/core';
import { SkipPrevious, SkipNext } from '@material-ui/icons';
import { Document, Page, pdfjs } from 'react-pdf';
import backendURL from '../../BackendUrl';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

function PdfReader() {
  const classes = useStyles();

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const validPage = () => {
    if (pageNumber < numPages && pageNumber > 0) {
      return pageNumber;
    } else if (pageNumber < 1) {
      return 1;
    } else if (pageNumber > (numPages - 1)) {
      return numPages - 1;
    }
  }

  return (
    <div style={{maxHeight: '100%', overflow: 'auto'}}>
      <Box m={2} component="div" overflow="hidden" style={{zoom: 0.90}}>
      <Document
        file={backendURL + "/pdf"}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Grid container spacing={1}>

          <Grid item>
            <Page pageNumber={validPage()}/>
          </Grid>

          <Grid item>
            {pageNumber > 1 ? <Page pageNumber={validPage() + 1} /> : <></>}
          </Grid>

          <Grid item>
            <List className={classes.root} subheader={<li />} style={{maxHeight: 500, overflow: 'auto'}}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((num) => (
                <ListItem>
                  <ListItem button>
                    <ListItemText primary={"Teutonenzeitung n°" + num}/>
                  </ListItem>
                </ListItem>
              ))}
            </List>
          </Grid>

        </Grid>
      </Document>

      <IconButton onClick={() => setPageNumber(pageNumber > 0 ? pageNumber - 1 : pageNumber)}>
        <SkipPrevious/>
      </IconButton>
      <IconButton onClick={() => setPageNumber(pageNumber < numPages ? pageNumber + 1 : numPages)}>
        <SkipNext/>
      </IconButton>

    </Box>
    </div>
  );
}

export default PdfReader;
