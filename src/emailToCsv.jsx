import React, { useState } from "react";
import { downloadEmails } from './api/EmailToCsv-ws'
const DownloadEmailsComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleDownload = async () => {
    try {
      await downloadEmails(email, password);
      alert('Download initiated!');
    } catch (error) {
      console.error("Error downloading emails:", error);
      alert('Failed to download emails.');
    }
  };

  return (
    <div>
      <input 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button onClick={handleDownload}>Download Emails</button>
    </div>
  );
};

export default DownloadEmailsComponent;
