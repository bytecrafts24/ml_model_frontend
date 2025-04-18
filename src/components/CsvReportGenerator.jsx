import React, { useRef, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  Title
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  Title
);

const CsvReportGenerator = ({ parsedData }) => {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const reportRef = useRef(null);
  const page1Ref = useRef(null);
  const page2Ref = useRef(null);
  const page3Ref = useRef(null);
  const page4Ref = useRef(null);

  // Process data for reports
  const processData = () => {
    if (!parsedData || parsedData.length === 0) {
      return {
        overview: {
          totalSessions: 0,
          avgScrollDepth: 0,
          totalRageClicks: 0,
          totalDeadClicks: 0,
          avgEngagementTime: 0
        },
        topPages: [],
        deviceBreakdown: {
          mobile: 0,
          desktop: 0,
          tablet: 0
        },
        countryBreakdown: []
      };
    }

    // Calculate overview metrics
    const totalSessions = parsedData.length;
    const avgScrollDepth = parsedData.reduce((sum, row) => sum + (parseFloat(row.scrollDepth) || 0), 0) / totalSessions;
    const totalRageClicks = parsedData.reduce((sum, row) => sum + (parseInt(row.rageClicks) || 0), 0);
    const totalDeadClicks = parsedData.reduce((sum, row) => sum + (parseInt(row.deadClicks) || 0), 0);
    const avgEngagementTime = parsedData.reduce((sum, row) => sum + (parseFloat(row.engagementTime) || 0), 0) / totalSessions;

    // Process top pages
    const pageMap = {};
    parsedData.forEach(row => {
      const url = row.pageUrl || 'Unknown';
      if (!pageMap[url]) {
        pageMap[url] = {
          pageUrl: url,
          sessions: 0,
          scrollDepth: 0,
          deadClicks: 0,
          rageClicks: 0
        };
      }
      
      pageMap[url].sessions += 1;
      pageMap[url].scrollDepth += parseFloat(row.scrollDepth) || 0;
      pageMap[url].deadClicks += parseInt(row.deadClicks) || 0;
      pageMap[url].rageClicks += parseInt(row.rageClicks) || 0;
    });

    // Calculate averages and sort pages by sessions
    const topPages = Object.values(pageMap).map(page => ({
      ...page,
      scrollDepth: page.scrollDepth / page.sessions
    })).sort((a, b) => b.sessions - a.sessions);

    // Process device breakdown
    const deviceCounts = {
      mobile: 0,
      desktop: 0,
      tablet: 0
    };

    parsedData.forEach(row => {
      const device = (row.device || '').toLowerCase();
      if (device.includes('mobile')) {
        deviceCounts.mobile += 1;
      } else if (device.includes('tablet')) {
        deviceCounts.tablet += 1;
      } else {
        deviceCounts.desktop += 1;
      }
    });

    // Process country breakdown
    const countryMap = {};
    parsedData.forEach(row => {
      const country = row.country || 'Unknown';
      if (!countryMap[country]) {
        countryMap[country] = 0;
      }
      countryMap[country] += 1;
    });

    const countryBreakdown = Object.entries(countryMap)
      .map(([country, sessions]) => ({ country, sessions }))
      .sort((a, b) => b.sessions - a.sessions);

    return {
      overview: {
        totalSessions,
        avgScrollDepth,
        totalRageClicks,
        totalDeadClicks,
        avgEngagementTime
      },
      topPages,
      deviceBreakdown: deviceCounts,
      countryBreakdown
    };
  };

  const processedData = processData();

  // Device breakdown chart data
  const deviceData = {
    labels: ['Mobile', 'Desktop', 'Tablet'],
    datasets: [
      {
        data: [
          processedData.deviceBreakdown.mobile,
          processedData.deviceBreakdown.desktop,
          processedData.deviceBreakdown.tablet
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  // Generate PDF
  const generatePDF = async () => {
    if (!reportRef.current) return;
    
    setGenerating(true);
    setProgress(0);
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Page 1: Overview
      if (page1Ref.current) {
        setProgress(10);
        const canvas1 = await html2canvas(page1Ref.current, { scale: 2 });
        const imgData1 = canvas1.toDataURL('image/png');
        pdf.addImage(imgData1, 'PNG', 0, 0, pageWidth, pageHeight);
        setProgress(25);
      }
      
      // Page 2: Top Pages
      if (page2Ref.current) {
        pdf.addPage();
        setProgress(30);
        const canvas2 = await html2canvas(page2Ref.current, { scale: 2 });
        const imgData2 = canvas2.toDataURL('image/png');
        pdf.addImage(imgData2, 'PNG', 0, 0, pageWidth, pageHeight);
        setProgress(50);
      }
      
      // Page 3: Device Breakdown
      if (page3Ref.current) {
        pdf.addPage();
        setProgress(60);
        const canvas3 = await html2canvas(page3Ref.current, { scale: 2 });
        const imgData3 = canvas3.toDataURL('image/png');
        pdf.addImage(imgData3, 'PNG', 0, 0, pageWidth, pageHeight);
        setProgress(75);
      }
      
      // Page 4: Country Breakdown
      if (page4Ref.current) {
        pdf.addPage();
        setProgress(85);
        const canvas4 = await html2canvas(page4Ref.current, { scale: 2 });
        const imgData4 = canvas4.toDataURL('image/png');
        pdf.addImage(imgData4, 'PNG', 0, 0, pageWidth, pageHeight);
        setProgress(95);
      }
      
      // Save the PDF
      pdf.save('website-analytics-report.pdf');
      setProgress(100);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="w-full p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Website Analytics Report</h1>
        <button
          onClick={generatePDF}
          disabled={generating}
          className="flex items-center gap-2 px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          {generating ? (
            <>
              <svg className="w-5 h-5 mr-3 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Generating... {progress}%
            </>
          ) : (
            'Download Report'
          )}
        </button>
      </div>

      <div ref={reportRef} className="hidden">
        {/* Page 1: Overview */}
        <div
          ref={page1Ref}
          className="w-[210mm] h-[297mm] p-8 bg-white"
          style={{ boxSizing: 'border-box' }}
        >
          <h2 className="mb-6 text-2xl font-bold text-center">Site Analytics Overview</h2>
          <p className="mb-8 text-center text-gray-600">
            Report generated on {new Date().toLocaleDateString()}
          </p>

          <div className="grid grid-cols-2 gap-6 mt-10">
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
              <h3 className="mb-2 text-lg font-semibold text-gray-800">Total Sessions</h3>
              <p className="text-3xl font-bold text-blue-600">
                {processedData.overview.totalSessions.toLocaleString()}
              </p>
            </div>

            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
              <h3 className="mb-2 text-lg font-semibold text-gray-800">Average Scroll Depth</h3>
              <p className="text-3xl font-bold text-indigo-600">
                {processedData.overview.avgScrollDepth.toFixed(1)}%
              </p>
            </div>

            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
              <h3 className="mb-2 text-lg font-semibold text-gray-800">Total Rage Clicks</h3>
              <p className="text-3xl font-bold text-red-600">
                {processedData.overview.totalRageClicks.toLocaleString()}
              </p>
            </div>

            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
              <h3 className="mb-2 text-lg font-semibold text-gray-800">Total Dead Clicks</h3>
              <p className="text-3xl font-bold text-amber-600">
                {processedData.overview.totalDeadClicks.toLocaleString()}
              </p>
            </div>

            <div className="col-span-2 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
              <h3 className="mb-2 text-lg font-semibold text-gray-800">Average Engagement Time</h3>
              <p className="text-3xl font-bold text-green-600">
                {processedData.overview.avgEngagementTime.toFixed(1)} seconds
              </p>
            </div>
          </div>
        </div>

        {/* Page 2: Top Pages Table */}
        <div
          ref={page2Ref}
          className="w-[210mm] h-[297mm] p-8 bg-white"
          style={{ boxSizing: 'border-box' }}
        >
          <h2 className="mb-6 text-2xl font-bold text-center">Top Pages by Traffic</h2>
          <p className="mb-8 text-center text-gray-600">
            Sorted by number of sessions in descending order
          </p>

          <div className="mt-6 overflow-hidden border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Page URL
                  </th>
                  <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Sessions
                  </th>
                  <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Scroll Depth
                  </th>
                  <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Dead Clicks
                  </th>
                  <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Rage Clicks
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {processedData.topPages.slice(0, 12).map((page, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-2 text-sm text-gray-900 truncate max-w-[200px]">
                      {page.pageUrl}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {page.sessions.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {page.scrollDepth.toFixed(1)}%
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {page.deadClicks.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {page.rageClicks.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Page 3: Device Breakdown */}
        <div
          ref={page3Ref}
          className="w-[210mm] h-[297mm] p-8 bg-white"
          style={{ boxSizing: 'border-box' }}
        >
          <h2 className="mb-6 text-2xl font-bold text-center">Device Usage Breakdown</h2>
          <p className="mb-8 text-center text-gray-600">
            Distribution of sessions across different device types
          </p>

          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <Pie 
                data={deviceData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        font: {
                          size: 14
                        }
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const label = context.label || '';
                          const value = context.raw || 0;
                          const total = context.dataset.data.reduce((a, b) => a + b, 0);
                          const percentage = Math.round((value / total) * 100);
                          return `${label}: ${value} sessions (${percentage}%)`;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-10">
            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-md">
              <h3 className="mb-2 text-base font-semibold text-gray-800">Mobile</h3>
              <p className="text-2xl font-bold text-pink-600">
                {processedData.deviceBreakdown.mobile.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                {processedData.overview.totalSessions > 0 
                  ? Math.round((processedData.deviceBreakdown.mobile / processedData.overview.totalSessions) * 100)
                  : 0}% of total
              </p>
            </div>

            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-md">
              <h3 className="mb-2 text-base font-semibold text-gray-800">Desktop</h3>
              <p className="text-2xl font-bold text-blue-600">
                {processedData.deviceBreakdown.desktop.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                {processedData.overview.totalSessions > 0 
                  ? Math.round((processedData.deviceBreakdown.desktop / processedData.overview.totalSessions) * 100)
                  : 0}% of total
              </p>
            </div>

            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-md">
              <h3 className="mb-2 text-base font-semibold text-gray-800">Tablet</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {processedData.deviceBreakdown.tablet.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                {processedData.overview.totalSessions > 0 
                  ? Math.round((processedData.deviceBreakdown.tablet / processedData.overview.totalSessions) * 100)
                  : 0}% of total
              </p>
            </div>
          </div>
        </div>

        {/* Page 4: Country Breakdown */}
        <div
          ref={page4Ref}
          className="w-[210mm] h-[297mm] p-8 bg-white"
          style={{ boxSizing: 'border-box' }}
        >
          <h2 className="mb-6 text-2xl font-bold text-center">User Distribution by Country</h2>
          <p className="mb-8 text-center text-gray-600">
            Geographical distribution of sessions
          </p>

          <div className="mt-6 overflow-hidden border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Country
                  </th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Sessions
                  </th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {processedData.countryBreakdown.slice(0, 15).map((country, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {country.country}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {country.sessions.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {processedData.overview.totalSessions > 0 
                        ? ((country.sessions / processedData.overview.totalSessions) * 100).toFixed(1)
                        : 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Visible Preview */}
      <div className="grid grid-cols-1 gap-8 mt-8">
        <div className="p-6 bg-white border rounded-lg shadow-md">
          <h3 className="mb-4 text-xl font-bold">Page 1: Overview</h3>
          <p className="text-gray-600">Shows key metrics like total sessions, average scroll depth, rage clicks, and engagement time.</p>
        </div>
        
        <div className="p-6 bg-white border rounded-lg shadow-md">
          <h3 className="mb-4 text-xl font-bold">Page 2: Top Pages</h3>
          <p className="text-gray-600">Table of top pages sorted by sessions, showing scroll depth, dead clicks, and rage clicks.</p>
        </div>
        
        <div className="p-6 bg-white border rounded-lg shadow-md">
          <h3 className="mb-4 text-xl font-bold">Page 3: Device Breakdown</h3>
          <p className="text-gray-600">Pie chart showing distribution of sessions across Mobile, Desktop, and Tablet devices.</p>
        </div>
        
        <div className="p-6 bg-white border rounded-lg shadow-md">
          <h3 className="mb-4 text-xl font-bold">Page 4: Country Breakdown</h3>
          <p className="text-gray-600">Table showing geographic distribution of sessions by country.</p>
        </div>
      </div>
    </div>
  );
};

export default CsvReportGenerator;