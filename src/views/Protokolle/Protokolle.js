import React from 'react';
import { PdfDisplay } from '../PdfDisplay/PdfDisplay';

export const Protokolle = () => {
  return (
    <PdfDisplay
      zoom={0.70}
      listNamePrefix=""
      pdfBackendPath="/protocol?protocolNb="
      pdfListBackendPath="/protocol-nbs"
    />
  );
};
