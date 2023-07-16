import React from 'react';
import { Document, Page } from 'react-pdf';

const PDFViewer = (props: {pdfUrl: string}) => {
  return (
    <div>
      <h1>PDF Viewer</h1>
      <Document file={props.pdfUrl}>
        <Page pageNumber={1} />
      </Document>
    </div>
  );
};

export default PDFViewer;