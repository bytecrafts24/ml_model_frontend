import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  TextField,
  CircularProgress,
  Alert
} from '@mui/material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// PDF page dimensions in mm (A4)
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const CANVAS_SCALE = 2; // Scaling for better quality
const PX_PER_MM = 3.78; // Approximate conversion from mm to pixels

// Default ByteCrafts logo
const DEFAULT_LOGO = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHN0eWxlPi5he2ZpbGw6IzAwNzJDNjt9PC9zdHlsZT48cGF0aCBjbGFzcz0iYSIgZD0iTTUwIDEwQzI3LjkgMTAgMTAgMjcuOSAxMCA1MGMwIDIyLjEgMTcuOSA0MCA0MCA0MGMyMi4xIDAgNDAtMTcuOSA0MC00MEw1MCAxMHoiLz48cGF0aCBkPSJNNDIgMjVoMTZ2NUg0MnYtNXptOCA1MGMtMTEgMC0yMC05LTIwLTIwczktMjAgMjAtMjAgMjAgOSAyMCAyMC05IDIwLTIwIDIwem0xMC0yMGMwIDUuNS00LjUgMTAtMTAgMTBzLTEwLTQuNS0xMC0xMCA0LjUtMTAgMTAtMTAgMTAgNC41IDEwIDEweiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==";

const PDFDesigner = ({ csvData, headers }) => {
  const [documentTitle, setDocumentTitle] = useState('Website Report');
  const [companyName, setCompanyName] = useState('ByteCrafts');
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState('');
  const [sessionData, setSessionData] = useState({
    totalSessions: 0,
    botSessions: 0
  });
  
  const pageRef = useRef(null);
  
  // Extract session data from CSV
  useEffect(() => {
    if (csvData && csvData.length > 0) {
      let totalSessions = 0;
      let botSessions = 0;
      
      csvData.forEach(row => {
        if (row.Sessions === 'Total sessions' && row.hasOwnProperty('Total sessions')) {
          totalSessions = parseInt(row['Total sessions']) || 0;
        } else if (row.Sessions === 'Bot sessions' && row.hasOwnProperty('Total sessions')) {
          botSessions = parseInt(row['Total sessions']) || 0;
        } else if (row.Type === 'Total sessions' && row.Value) {
          totalSessions = parseInt(row.Value) || 0;
        } else if (row.Type === 'Bot sessions' && row.Value) {
          botSessions = parseInt(row.Value) || 0;
        }
      });
      
      setSessionData({
        totalSessions: totalSessions || 25,
        botSessions: botSessions || 4
      });
    }
  }, [csvData]);
  
  // Generate PDF with the static design
  const generatePDF = async () => {
    setPdfGenerating(true);
    setError('');
    
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      pdf.setProperties({
        title: documentTitle,
        subject: 'Website Report',
        author: companyName,
        creator: 'PDF Designer Tool'
      });
      
      if (pageRef && pageRef.current) {
        const canvas = await html2canvas(pageRef.current, {
          scale: CANVAS_SCALE,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        });
        
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, PAGE_WIDTH, PAGE_HEIGHT);
      }
      
      const pdfBlob = pdf.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      
      window.designedPdf = pdf;
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError(`Error generating PDF: ${err.message}`);
    } finally {
      setPdfGenerating(false);
    }
  };
  
  // Download generated PDF
  const downloadPDF = () => {
    if (window.designedPdf) {
      window.designedPdf.save(`${documentTitle.replace(/\s+/g, '_')}.pdf`);
    }
  };
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Static PDF Designer
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Document Title"
          value={documentTitle}
          onChange={(e) => setDocumentTitle(e.target.value)}
          size="small"
          sx={{ width: '250px' }}
        />
        
        <TextField
          label="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          size="small"
          sx={{ width: '250px' }}
        />
        
        <Button 
          variant="contained" 
          color="primary"
          onClick={generatePDF}
          disabled={pdfGenerating}
          startIcon={pdfGenerating ? <CircularProgress size={20} /> : null}
        >
          Generate PDF
        </Button>
        
        {pdfUrl && (
          <Button 
            variant="outlined"
            onClick={downloadPDF}
          >
            Download PDF
          </Button>
        )}
      </Box>
      
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}
      
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        mb: 3, 
        backgroundColor: '#f5f5f5',
        p: 3,
        borderRadius: 1,
        overflowX: 'auto',
        height: 'calc(100vh - 200px)'
      }}>
        <Paper
          ref={pageRef}
          elevation={3}
          sx={{
            width: `${PAGE_WIDTH * PX_PER_MM}px`,
            height: `${PAGE_HEIGHT * PX_PER_MM}px`,
            position: 'relative',
            backgroundColor: '#ffffff',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '60px',
            backgroundColor: '#f8f8f8',
            borderBottom: '1px solid #ddd',
            display: 'flex',
            alignItems: 'center',
            padding: '0 20px',
            boxSizing: 'border-box'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              flex: 1 
            }}>
              <img 
                src={DEFAULT_LOGO} 
                alt="ByteCrafts Logo" 
                style={{ 
                  height: '40px', 
                  marginRight: '10px' 
                }} 
              />
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 'bold',
                  color: '#0072C6'
                }}
              >
                {companyName}
              </Typography>
            </div>
            <div>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'bold',
                  textAlign: 'right',
                  color: '#333'
                }}
              >
                {documentTitle}
              </Typography>
            </div>
          </div>
          
          <div style={{ 
            position: 'relative',
            marginTop: '80px',
            marginBottom: '50px',
            padding: '20px',
            height: 'calc(100% - 130px)',
          }}>
            <div style={{ 
              marginBottom: '30px',
              backgroundColor: '#f8f8f8',
              borderRadius: '8px',
              padding: '15px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <Typography variant="h5" gutterBottom sx={{ color: '#0072C6', fontWeight: 'bold' }}>
                Session Summary
              </Typography>
              
              <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '15px' }}>
                <div style={{
                  textAlign: 'center',
                  padding: '15px 20px',
                  backgroundColor: '#0072C6',
                  borderRadius: '8px',
                  color: 'white',
                  minWidth: '150px'
                }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {sessionData.totalSessions}
                  </Typography>
                  <Typography variant="body2">
                    Total Sessions
                  </Typography>
                </div>
                
                <div style={{
                  textAlign: 'center',
                  padding: '15px 20px',
                  backgroundColor: '#E74C3C',
                  borderRadius: '8px',
                  color: 'white',
                  minWidth: '150px'
                }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {sessionData.botSessions}
                  </Typography>
                  <Typography variant="body2">
                    Bot Sessions
                  </Typography>
                </div>
                
                <div style={{
                  textAlign: 'center',
                  padding: '15px 20px',
                  backgroundColor: '#27AE60',
                  borderRadius: '8px',
                  color: 'white',
                  minWidth: '150px'
                }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {sessionData.totalSessions - sessionData.botSessions}
                  </Typography>
                  <Typography variant="body2">
                    Human Sessions
                  </Typography>
                </div>
              </div>
              
              <Typography variant="body2" sx={{ textAlign: 'right', marginTop: '10px', fontStyle: 'italic' }}>
                {Math.round((sessionData.botSessions / sessionData.totalSessions) * 100)}% of all traffic was from bots
              </Typography>
            </div>
            
            <div style={{ marginBottom: '30px' }}>
              <Typography variant="h5" gutterBottom sx={{ color: '#0072C6', fontWeight: 'bold' }}>
                Website Analytics Overview
              </Typography>
              <Typography variant="body1" paragraph>
                This report provides a comprehensive analysis of the website performance metrics for the past quarter.
                The data highlights key trends in user engagement, traffic sources, and conversion rates.
              </Typography>
              <Typography variant="body1">
                Key insights from this period:
              </Typography>
              <ul style={{ marginLeft: '20px' }}>
                <li>15% increase in overall user engagement</li>
                <li>Mobile traffic grew by 22% compared to previous quarter</li>
                <li>Average session duration improved to 4.5 minutes</li>
                <li>Conversion rate optimizations resulted in 8% higher sales</li>
              </ul>
            </div>
            
            <div style={{ marginBottom: '30px' }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#0072C6' }}>
                Traffic Source Breakdown
              </Typography>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '15px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f0f0f0' }}>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Source</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Sessions</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Conversion Rate</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>Organic Search</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>12,450</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>3.2%</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>$28,350</td>
                  </tr>
                  <tr style={{ backgroundColor: '#f9f9f9' }}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>Direct</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>8,270</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>4.5%</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>$32,180</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>Social Media</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>6,840</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>2.8%</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>$15,730</td>
                  </tr>
                  <tr style={{ backgroundColor: '#f9f9f9' }}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>Email</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>4,390</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>5.2%</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>$22,450</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>Referral</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>3,280</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>3.7%</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>$12,680</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div>
              <Typography variant="h6" gutterBottom sx={{ color: '#0072C6' }}>
                Recommendations
              </Typography>
              <Typography variant="body1" paragraph>
                Based on the analysis of the current performance metrics, we recommend the following actions:
              </Typography>
              <ol style={{ marginLeft: '20px' }}>
                <li>Increase investment in email marketing campaigns by 15%</li>
                <li>Optimize landing pages for mobile users to improve conversion rates</li>
                <li>Expand content marketing efforts targeting organic search traffic</li>
                <li>Implement A/B testing for key product pages to identify conversion optimizations</li>
              </ol>
              <Typography variant="body1" paragraph sx={{ marginTop: '20px', fontStyle: 'italic' }}>
                For detailed analytics and custom reports, please contact your {companyName} account manager.
              </Typography>
            </div>
          </div>
          
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '30px',
            backgroundColor: '#f8f8f8',
            borderTop: '1px solid #ddd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            boxSizing: 'border-box',
            fontSize: '12px',
            color: '#666'
          }}>
            <div>
              Generated by {companyName} PDF Designer
            </div>
            <div>
              Page 1 of 1 | {new Date().toLocaleDateString()}
            </div>
          </div>
        </Paper>
      </Box>
      
      {pdfUrl && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            PDF Preview
          </Typography>
          <Box
            sx={{
              width: '100%',
              height: '500px',
              border: '1px solid #ddd',
              borderRadius: 1,
              overflow: 'hidden'
            }}
          >
            <iframe
              src={pdfUrl}
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="PDF Preview"
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default PDFDesigner;
