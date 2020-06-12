import React from 'react';
import { PdfDisplay } from '../PdfDisplay/PdfDisplay';

export const TeutonenZeitung = () => {
  return (
    <PdfDisplay
      zoom={0.95}
      listNamePrefix="Teutonenzeitung n°"
      pdfBackendPath="/tz?tzNb="
      pdfListBackendPath="/tz-nbs"
    />
  );
};
