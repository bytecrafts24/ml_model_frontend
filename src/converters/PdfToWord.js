 
   import React, { useState } from "react";
   import { Button, CircularProgress, Typography } from "@mui/material";
   import { saveAs } from "file-saver";
   import { Document, Packer, Paragraph } from "docx";
   import * as pdfjsLib from "pdfjs-dist/webpack";
   import { GlobalWorkerOptions } from "pdfjs-dist";

   GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

   const PdfToWordConverter = () => {
     const [pdfFile, setPdfFile] = useState(null);
     const [fileName, setFileName] = useState("No file chosen");
     const [loading, setLoading] = useState(false);

     const handleFileChange = (event) => {
       const file = event.target.files[0];
       if (file) {
         console.log("Selected file:", file);
         setFileName(file.name);
         setPdfFile(file);
       }
     };

     const convertPdfToWord = async () => {
       if (!pdfFile) {
         console.log("No PDF file selected.");
         return;
       }


       if (pdfFile.type !== "application/pdf") {
         console.error("Selected file is not a PDF.");
         return;
       }

       try {
         setLoading(true);
         const url = URL.createObjectURL(pdfFile);
         const loadingTask = pdfjsLib.getDocument(url);
         
         loadingTask.promise.then(
           async (pdf) => {
             console.log("PDF loaded:", pdf);
             const textArray = [];
             for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
               const page = await pdf.getPage(pageNumber);
               const textContent = await page.getTextContent();
               const pageText = textContent.items
                 .map((item) => item.str)
                 .join(" ");
               textArray.push(pageText);
             }


             const doc = new Document({
               sections: [{
                 properties: {},
                 children: textArray.map((text, index) => [
                   new Paragraph({
                     text: `Page ${index + 1}`,
                     heading: "Heading2",
                   }),
                   new Paragraph(text),
                 ]).flat(),
               }],
             });

             const wordBlob = await Packer.toBlob(doc);
             saveAs(wordBlob, `${fileName.replace(".pdf", "")}.docx`);
           },
           (error) => {
             console.error("Error loading PDF:", error);
           }
         );
       } catch (error) {
         console.error("Error during conversion:", error);
       } finally {
         setLoading(false);
       }
     };

     return (
       <div style={{ textAlign: "center", width: "80%", margin: "auto" }}>
         <h1>PDF to Word Converter</h1>
         <input
           type="file"
           accept="application/pdf"
           style={{ display: "none" }}
           id="fileInput"
           onChange={handleFileChange}
         />
         <label htmlFor="fileInput" style={{ cursor: "pointer", marginBottom: "20px" }}>
           <Button variant="contained" component="span">
             Select PDF
           </Button>
           <Typography variant="body2">{fileName}</Typography>
         </label>

         <Button
           variant="contained"
           color="primary"
           onClick={convertPdfToWord}
           disabled={!pdfFile || loading}
         >
           Convert to Word
         </Button>
         {loading && <CircularProgress style={{ marginTop: "20px" }} />}
       </div>
     );
   };

   export default PdfToWordConverter;