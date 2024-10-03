// import React, { useState } from 'react';
// import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';

// const QrCodeGenerator = () => {
//   const [text, setText] = useState('');
//   const [useSvg, setUseSvg] = useState(false); 
//   return (
//     <div style={{ textAlign: 'center', marginTop: '50px' }}>
//       <h2>QR Code Generator</h2>
//       <input 
//         type="text" 
//         value={text} 
//         onChange={(e) => setText(e.target.value)} 
//         placeholder="Enter text to generate QR code" 
//         style={{ padding: '10px', marginBottom: '20px', width: '300px' }}
//       />
//       <div style={{ marginBottom: '20px' }}>
//         <label>
//           <input 
//             type="checkbox" 
//             checked={useSvg} 
//             onChange={(e) => setUseSvg(e.target.checked)} 
//           />
//           {' '} Use SVG instead of Canvas
//         </label>
//       </div>
//       <div>
//         {text && (
//           useSvg ? (
//             <QRCodeSVG value={text} size={256} /> 
//           ) : (
//             <QRCodeCanvas value={text} size={256} /> 
//           )
//         )}
//       </div>
//     </div>
//   );
// };

// export default QrCodeGenerator;

import React, { useState, useRef } from 'react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';

const QrCodeGenerator = () => {
  const [text, setText] = useState('');
  const [useSvg, setUseSvg] = useState(false);
  const qrCodeRef = useRef(null); // For Canvas
  const svgRef = useRef(null); // For SVG

  const downloadQRCode = () => {
    if (useSvg) {
      // Download SVG
      const svg = svgRef.current.querySelector('svg');
      const svgBlob = new Blob([svg.outerHTML], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'qrcode.svg'; // Set the filename for SVG
      link.click();
      URL.revokeObjectURL(url); // Clean up URL
    } else {
      // Download Canvas
      const canvas = qrCodeRef.current;
      if (canvas) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png'); // Convert canvas to PNG image
        link.download = 'qrcode.png'; // Set the filename for Canvas
        link.click(); // Trigger the download
      }
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>QR Code Generator</h2>
      <input 
        type="text" 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
        placeholder="Enter text to generate QR code" 
        style={{ padding: '10px', marginBottom: '20px', width: '300px' }}
      />
      <div style={{ marginBottom: '20px' }}>
        <label>
          <input 
            type="checkbox" 
            checked={useSvg} 
            onChange={(e) => setUseSvg(e.target.checked)} 
          />
          {' '} Use SVG instead of Canvas
        </label>
      </div>
      <div>
        {text && (
          useSvg ? (
            <div ref={svgRef}>
              <QRCodeSVG value={text} size={256} />
            </div>
          ) : (
            <QRCodeCanvas ref={qrCodeRef} value={text} size={256} />
          )
        )}
      </div>
      {text && (
        <button onClick={downloadQRCode} style={{ marginTop: '20px', padding: '10px 20px' }}>
          Download QR Code
        </button>
      )}
    </div>
  );
};

export default QrCodeGenerator;
