import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Grid,
  Typography,
  Button,
  IconButton,
  colors,
  List,
  ListItem,
} from '@material-ui/core';
import { SkipPrevious, SkipNext } from '@material-ui/icons';
import { Document, Page, pdfjs } from 'react-pdf';

import backendURL from '../../BackendUrl';
import { getPdfNbs } from '../../backend-calls/Pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  button: {
    color: colors.blueGrey[800],
    textTransform: 'none', 
    fontWeight: theme.typography.fontWeightRegular,
  },
  active: {
    color: theme.palette.primary.main,
    textTransform: 'none',
    fontSize: 15,
    fontWeight: theme.typography.fontWeightBold
  }
}));

const PdfPage = props => {
  const numPages = props.numPages;
  const [pageNumber, setPageNumber] = useState(1);

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
    <>
      <Grid container spacing={1}>
        <Grid item>
          {pageNumber > 1 && (pageNumber < numPages || (numPages % 2 === 1)) ? <Page pageNumber={validPage() - 1} /> : <></>}
        </Grid>
        <Grid item>
          <Page pageNumber={validPage()}/>
        </Grid>
      </Grid>
      <IconButton onClick={() => setPageNumber(pageNumber > 1 ? pageNumber - 2 : pageNumber)}>
        <SkipPrevious/>
      </IconButton>
      <IconButton onClick={() => setPageNumber(pageNumber < (numPages - 1) ? pageNumber + 2 : numPages)}>
        <SkipNext/>
      </IconButton>
      <Typography variant="caption">
        Seite {(pageNumber - 1) && (pageNumber !== numPages || numPages % 2 === 1) ? (pageNumber - 1) + "," : ""}{pageNumber} / {numPages}
      </Typography>
    </>
  );
};

export const PdfDisplay = props => {
  const { zoom, listNamePrefix, pdfBackendPath, pdfListBackendPath } = props;
  const classes = useStyles();

  const [numPages, setNumPages] = useState(1);
  const [ pdfNb, setPdfNb ] = useState(0);
  const [ pdfList, setPdfList ] = useState([]);
  useEffect(() => getPdfNbs(pdfListBackendPath, setPdfList, setPdfNb), []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  }

  return (
    <div style={{maxHeight: '100%', overflow: 'visible'}}>
      <Box m={2} component="div" overflow="hidden" style={{zoom: zoom, float: 'left'}}>
        <Document
          file={{ url: backendURL + pdfBackendPath + pdfNb, withCredentials: true }}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <PdfPage numPages={numPages} />
        </Document>
      </Box>

      <Box m={2} style={{ float: 'right' }}>
        <Box m={0} style={{ maxHeight: 400, overflow: 'auto' }} >
          <List className={classes.root} subheader={<li />} >
            {pdfList.map((num) => (
              <ListItem key={num}>
                <Button className={num === pdfNb ? classes.active : classes.button} onClick={() => { 
                  console.log(num);
                  setPdfNb(num);
                }}
                >
                  {listNamePrefix + num}
                </Button>
              </ListItem>
            ))}
          </List>
        </Box>

        <div style={{ padding: '20px 0px', textAlign: 'center' }}>
          <Button 
            variant="contained"
            color="primary"
            fullWidth
            href={backendURL + pdfBackendPath + pdfNb}
            target="_blank"
            rel="noopener noreferrer"
          >
            Download
          </Button>
        </div>
      </Box>
    </div>
  );
}
