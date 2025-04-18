import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Grid
} from '@mui/material';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
// Import jspdf-autotable directly after jsPDF
import 'jspdf-autotable';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import CsvReportGenerator from './components/CsvReportGenerator';
import PDFDesigner from './components/PDFDesigner';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

const Clarity = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pdfUrl, setPdfUrl] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [chartType, setChartType] = useState('bar');
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [showAnalyticsReport, setShowAnalyticsReport] = useState(false);
  const [showPDFDesigner, setShowPDFDesigner] = useState(false);
  const pdfContainer = useRef(null);
  const chartRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPdfUrl(null);
      setError('');
      parseCSV(selectedFile);
    }
  };

  const parseCSV = (csvFile) => {
    if (!csvFile) {
      setError('Please select a CSV file first');
      return;
    }

    setLoading(true);
    
    Papa.parse(csvFile, {
      header: true,
      dynamicTyping: true, // Automatically convert numeric values
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          // Filter out empty rows
          const filteredData = results.data.filter(row => 
            Object.values(row).some(value => value !== '' && value !== null)
          );
          
          setData(filteredData);
          
          // Extract headers
          if (filteredData.length > 0) {
            const extractedHeaders = Object.keys(filteredData[0]);
            setHeaders(extractedHeaders);
            
            // Set default X and Y axis for charts if not already set
            if (!xAxis && extractedHeaders.length > 0) {
              setXAxis(extractedHeaders[0]);
            }
            
            if (!yAxis && extractedHeaders.length > 1) {
              // Try to find a numeric column for Y-axis
              const numericColumn = extractedHeaders.find(header => 
                typeof filteredData[0][header] === 'number'
              );
              setYAxis(numericColumn || extractedHeaders[1]);
            }
          }
        } else {
          setError('No data found in the CSV file');
        }
        setLoading(false);
      },
      error: (error) => {
        setError(`Error parsing CSV: ${error.message}`);
        setLoading(false);
      }
    });
  };

  const getChartData = () => {
    if (!data || !xAxis || !yAxis) return null;

    // Extract unique x-axis values
    const labels = [...new Set(data.map(item => item[xAxis] !== undefined ? String(item[xAxis]) : 'undefined'))];
    
    // Group data by x-axis and calculate average for y-axis
    const dataPoints = labels.map(label => {
      const matchingRows = data.filter(row => String(row[xAxis]) === label);
      const sum = matchingRows.reduce((acc, row) => acc + (parseFloat(row[yAxis]) || 0), 0);
      return matchingRows.length > 0 ? sum / matchingRows.length : 0;
    });

    // Generate random colors for the chart
    const backgroundColor = labels.map(() => 
      `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`
    );

    return {
      labels,
      datasets: [
        {
          label: `${yAxis} by ${xAxis}`,
          data: dataPoints,
          backgroundColor,
          borderColor: backgroundColor.map(color => color.replace('0.6', '1')),
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: xAxis && yAxis ? `${yAxis} by ${xAxis}` : 'Data Visualization',
      },
    },
  };

  const toggleAnalyticsReport = () => {
    setShowAnalyticsReport(!showAnalyticsReport);
    setShowPDFDesigner(false);
  };

  const togglePDFDesigner = () => {
    setShowPDFDesigner(!showPDFDesigner);
    setShowAnalyticsReport(false);
  };

  const generatePDF = async () => {
    if (!data || data.length === 0) {
      setError('No data available to generate PDF');
      return;
    }

    setGenerating(true);
    
    try {
      // Prepare chart for PDF if needed
      let chartImage = null;
      if (chartRef.current) {
        chartImage = chartRef.current.toBase64Image();
      }
      
      // Create a new PDF document in A4 format (210mm × 297mm)
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Import jspdf-autotable dynamically if autoTable is not available
      if (typeof doc.autoTable !== 'function') {
        console.log('autoTable not available, attempting dynamic import');
        
        // Create simple table manually
        const startY = 40;
        const startX = 20;
        const cellWidth = 20;
        const cellHeight = 8;
        const margin = 10;
        
        // Add title and metadata
        const title = file ? file.name.replace('.csv', '') : 'CSV Data';
        doc.setFontSize(20);
        doc.setTextColor(40, 40, 40);
        doc.text(title, 105, 15, { align: 'center' });
        
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, { align: 'center' });
        doc.text(`File: ${file.name}`, 20, 30);
        doc.text(`Records: ${data.length}`, 20, 35);
        
        // Table headers
        doc.setFontSize(9);
        doc.setTextColor(40, 40, 40);
        headers.forEach((header, i) => {
          const cellX = startX + (i * cellWidth);
          if (cellX + cellWidth < doc.internal.pageSize.getWidth() - margin) {
            doc.text(header.substring(0, 8), cellX, startY);
          }
        });
        
        // Table data (first 10 rows)
        doc.setFontSize(8);
        const tableData = data.slice(0, 10).map(row => headers.map(header => row[header]));
        tableData.forEach((row, rowIndex) => {
          const y = startY + ((rowIndex + 1) * cellHeight);
          row.forEach((cell, cellIndex) => {
            const cellX = startX + (cellIndex * cellWidth);
            if (cellX + cellWidth < doc.internal.pageSize.getWidth() - margin) {
              const cellValue = String(cell || '').substring(0, 8);
              doc.text(cellValue, cellX, y);
            }
          });
        });
        
        // Add chart if available
        if (chartImage) {
          doc.addPage();
          doc.setFontSize(16);
          doc.setTextColor(40, 40, 40);
          doc.text('Data Visualization', 105, 20, { align: 'center' });
          
          const imgWidth = 170;
          const imgHeight = 100;
          const pageWidth = doc.internal.pageSize.getWidth();
          const x = (pageWidth - imgWidth) / 2;
          doc.addImage(chartImage, 'PNG', x, 50, imgWidth, imgHeight);
        }
      } else {
        // Add title and metadata
        const title = file ? file.name.replace('.csv', '') : 'CSV Data';
        doc.setProperties({
          title: title,
          subject: 'CSV Data Export with Visualization',
          author: 'ByteCrafts Clarity',
          creator: 'ByteCrafts'
        });
        
        // Add header
        doc.setFontSize(20);
        doc.setTextColor(40, 40, 40);
        doc.text(title, 105, 15, { align: 'center' });
        
        // Add date
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, { align: 'center' });
        
        // Add metadata about the file
        doc.setFontSize(10);
        doc.text(`File: ${file.name}`, 20, 30);
        doc.text(`Records: ${data.length}`, 20, 35);
        
        // Prepare data for the table
        const tableData = data.map(row => headers.map(header => row[header]));
        
        // Use autoTable plugin
        try {
          doc.autoTable({
            head: [headers],
            body: tableData,
            startY: 40,
            headStyles: {
              fillColor: [60, 60, 233],
              textColor: [255, 255, 255],
              fontStyle: 'bold'
            },
            styles: {
              fontSize: 8,
              cellPadding: 2,
            },
            alternateRowStyles: {
              fillColor: [240, 240, 255]
            },
            margin: { top: 40 },
            didDrawPage: (data) => {
              // Footer on each page
              doc.setFontSize(8);
              doc.setTextColor(100, 100, 100);
              doc.text(
                'Generated by ByteCrafts Clarity',
                data.settings.margin.left,
                doc.internal.pageSize.height - 10
              );
              doc.text(
                `Page ${doc.internal.getCurrentPageInfo().pageNumber}`,
                doc.internal.pageSize.width - data.settings.margin.right,
                doc.internal.pageSize.height - 10,
                { align: 'right' }
              );
            }
          });
        } catch (autoTableError) {
          console.error('Error using autoTable:', autoTableError);
          // Fallback to basic PDF without table
          doc.text('Error generating table. Basic PDF created instead.', 20, 50);
          doc.text(`Data contains ${data.length} rows and ${headers.length} columns.`, 20, 60);
        }
        
        // Add chart if available
        if (chartImage) {
          // Add a new page for the chart
          doc.addPage();
          
          // Add title for the chart page
          doc.setFontSize(16);
          doc.setTextColor(40, 40, 40);
          doc.text('Data Visualization', 105, 20, { align: 'center' });
          
          // Add chart description
          doc.setFontSize(10);
          doc.setTextColor(80, 80, 80);
          doc.text(`Chart Type: ${chartType.toUpperCase()}`, 20, 30);
          doc.text(`X-Axis: ${xAxis}`, 20, 35);
          doc.text(`Y-Axis: ${yAxis}`, 20, 40);
          
          // Add the chart image
          const imgWidth = 170;
          const imgHeight = 100;
          const pageWidth = doc.internal.pageSize.getWidth();
          const x = (pageWidth - imgWidth) / 2;
          doc.addImage(chartImage, 'PNG', x, 50, imgWidth, imgHeight);
          
          // Add notes about the chart
          doc.setFontSize(9);
          doc.setTextColor(100, 100, 100);
          doc.text('Note: This chart visualizes the relationship between the selected data points.', 20, 160);
          doc.text('The visualization helps in identifying patterns and trends in the dataset.', 20, 165);
        }
      }
      
      // Generate PDF blob URL for preview
      const pdfBlob = doc.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      
      // Store PDF content for later download
      window.pdfDoc = doc;
      
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError(`Error generating PDF: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const downloadPDF = () => {
    if (window.pdfDoc) {
      const fileName = file ? `${file.name.replace('.csv', '')}_report.pdf` : 'data_report.pdf';
      window.pdfDoc.save(fileName);
    }
  };

  // Clean up blob URL when component unmounts
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  // This is used for chart generation but not displayed 
  const renderChartOffscreen = () => {
    const chartData = getChartData();
    if (!chartData) return null;

    switch (chartType) {
      case 'line':
        return <Line ref={chartRef} data={chartData} options={chartOptions} height={300} />;
      case 'bar':
        return <Bar ref={chartRef} data={chartData} options={chartOptions} height={300} />;
      case 'pie':
        return <Pie ref={chartRef} data={chartData} options={chartOptions} height={300} />;
      default:
        return <Bar ref={chartRef} data={chartData} options={chartOptions} height={300} />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Clarity - CSV Data to PDF Exporter
      </Typography>
      
      <Typography variant="body1" paragraph>
        Upload a CSV file to generate a professional PDF report or design a custom PDF layout.
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          component="label"
        >
          Select CSV File
          <input
            type="file"
            accept=".csv"
            hidden
            onChange={handleFileChange}
          />
        </Button>
        
        {data && (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={generatePDF}
              disabled={generating || showPDFDesigner}
            >
              {generating ? <CircularProgress size={24} /> : 'Generate Standard PDF'}
            </Button>
            
            <Button
              variant="contained"
              color="secondary"
              onClick={toggleAnalyticsReport}
              disabled={!data || showPDFDesigner}
            >
              {showAnalyticsReport ? 'Hide Analytics Report' : 'Show Analytics Report'}
            </Button>
            
            <Button
              variant="contained"
              color="info"
              onClick={togglePDFDesigner}
              disabled={!data}
            >
              {showPDFDesigner ? 'Hide PDF Designer' : 'Design Custom PDF'}
            </Button>
            
            {pdfUrl && !showPDFDesigner && (
              <Button
                variant="contained"
                color="success"
                onClick={downloadPDF}
              >
                Download PDF
              </Button>
            )}
          </>
        )}
      </Box>
      
      {file && (
        <Typography variant="body2" sx={{ mb: 2 }}>
          Selected file: {file.name} ({data ? data.length : 0} records)
        </Typography>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Hidden chart for PDF generation */}
      <div style={{ position: 'absolute', visibility: 'hidden', height: 0, width: 0, overflow: 'hidden' }}>
        {renderChartOffscreen()}
      </div>

      {/* PDF Designer */}
      {data  && (
        <Box sx={{ mt: 4, height: 'calc(100vh - 250px)' }}>
          <PDFDesigner csvData={data} headers={headers} />
        </Box>
      )}

      {/* Analytics Report */}
      {data && showAnalyticsReport && !showPDFDesigner && (
        <Box sx={{ mt: 4, mb: 8 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <CsvReportGenerator parsedData={data} />
          </Paper>
        </Box>
      )}
      
      {/* PDF Preview */}
      {pdfUrl && !showAnalyticsReport && !showPDFDesigner && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            PDF Preview
          </Typography>
          
          <Paper 
            elevation={3} 
            sx={{ 
              width: '100%', 
              height: '600px',
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              backgroundColor: '#f0f0f0'
            }}
          >
            <iframe
              ref={pdfContainer}
              src={pdfUrl}
              title="PDF Preview"
              width="100%"
              height="100%"
              style={{ border: 'none' }}
            />
          </Paper>
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={downloadPDF}
              sx={{ mt: 2 }}
            >
              Download PDF
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Clarity;