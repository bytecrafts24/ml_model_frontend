import React, { useState } from 'react';
import { Button, Box } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { PDFDocument } from 'pdf-lib';

const PdfMerger = () => {
  const [mergedPdf, setMergedPdf] = useState(null);

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);

    if (files.length === 0) return;

    const mergedPdfDoc = await PDFDocument.create();

    for (const file of files) {
      const fileData = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileData);

      const copiedPages = await mergedPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
      copiedPages.forEach((page) => {
        mergedPdfDoc.addPage(page);
      });
    }

    const mergedPdfBytes = await mergedPdfDoc.save();
    setMergedPdf(mergedPdfBytes);
  };

  const downloadMergedPdf = () => {
    if (!mergedPdf) return;

    const blob = new Blob([mergedPdf], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'merged_document.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h2>PDF Merger</h2>

      <input
        type="file"
        accept=".pdf"
        multiple
        style={{ display: 'none' }}
        id="upload-pdf"
        onChange={handleFileUpload}
      />
      <label htmlFor="upload-pdf">
        <Button
          variant="contained"
          component="span"
          startIcon={<UploadFileIcon />}
        >
          Upload PDF Files
        </Button>
      </label>

      <br /><br />

      {mergedPdf && (
        <div>
          <h3>Merged PDF is Ready</h3>
          <Box
            sx={{
              border: '1px solid #ccc',
              padding: '10px',
              borderRadius: '4px',
              backgroundColor: '#f9f9f9',
              textAlign: 'center',
            }}
          >
            Your merged PDF is ready for download.
          </Box>

          <br />

          <Button
            variant="contained"
            color="success"
            onClick={downloadMergedPdf}
          >
            Download Merged PDF
          </Button>
        </div>
      )}
    </div>
  );
};

export default PdfMerger;
