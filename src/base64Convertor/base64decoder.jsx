import React, { useState } from 'react';

function Base64Decoder() {
  const [base64Input, setBase64Input] = useState('');
  const [decodedOutput, setDecodedOutput] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleDecode = () => {
    try {
    
      const base64String = base64Input.split(',')[1] || base64Input; 
      const decodedString = atob(base64String);
      

      const byteNumbers = new Array(decodedString.length);
      for (let i = 0; i < decodedString.length; i++) {
        byteNumbers[i] = decodedString.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);


      const blob = new Blob([byteArray], { type: 'image/png' });
      const url = URL.createObjectURL(blob);
      
      setDecodedOutput('Image decoded successfully!');
      setImageUrl(url);
    } catch (error) {
      setDecodedOutput('Invalid Base64 string');
      setImageUrl('');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Base64 Decoder</h2>
      <textarea
        placeholder="Enter Base64 string"
        value={base64Input}
        onChange={(e) => setBase64Input(e.target.value)}
        style={{ width: '400px', height: '200px', padding: '10px' }} // Adjusted height for better visibility
      />

      <br />
      <button onClick={handleDecode} style={{ marginTop: '10px', padding: '10px 20px' }}>
        Decode
      </button>
      <h3>{decodedOutput}</h3>
      {imageUrl && (
        <div>
          <h4>Decoded Image:</h4>
          <img src={imageUrl} alt="Decoded" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
      )}
    </div>
  );
}

export default Base64Decoder;
