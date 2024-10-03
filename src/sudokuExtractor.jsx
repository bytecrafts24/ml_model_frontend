import React, { useState } from 'react';
import { extract } from './api/Sudoku-ws';

const SudokuExtractor = ({ onExtract }) => {
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recognizedBoard, setRecognizedBoard] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setError(null);
      convertImageToBase64(file); // Convert image to Base64 on upload
    } else {
      setError('Please upload a valid image file.');
    }
  };

  // Function to convert image to Base64
  const convertImageToBase64 = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result); // Set the Base64 string in state
    };
    reader.readAsDataURL(file);
  };

  const extractSudoku = async () => {
    if (!imageBase64) { // Check for Base64 string
      setError('Please upload an image first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await extract(imageBase64); // Use the Base64 string for extraction
      if (response?.data?.recognized_board) {
        setRecognizedBoard(response.data.recognized_board);
        onExtract(response.data.recognized_board);
      } else {
        setError('No Sudoku board detected. Please try with another image.');
      }
    } catch (err) {
      setError('Failed to extract Sudoku from the image. Please try again.');
      console.error('Extraction error:', err);
    }

    setLoading(false);
  };

  return (
    <div>
      <h2>Upload Sudoku Image</h2>
      <input type="file" accept="image/*" onChange={handleImageUpload} disabled={loading} />
      <button onClick={extractSudoku} disabled={loading || !image}>
        {loading ? 'Extracting...' : 'Extract Sudoku'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {recognizedBoard && (
        <div>
          <h3>Recognized Sudoku Board:</h3>
          <pre>{JSON.stringify(recognizedBoard, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default SudokuExtractor;



// import React, { useState } from 'react';
// import { extract } from './api/Sudoku-ws'

// const SudokuExtractor = ({ onExtract }) => {
//   const [image, setImage] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [recognizedBoard, setRecognizedBoard] = useState(null);

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(file);
//     }
//   };

//   const extractSudoku = async () => {
//     if (!image) {
//       setError('Please upload an image first.');
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const response = await extract(image);
//       setRecognizedBoard(response.data.recognized_board);
//       onExtract(response.data.recognized_board);
//     } catch (err) {
//       setError('Failed to extract Sudoku from image.');
//       console.error(err);
//     }

//     setLoading(false);
//   };

//   return (
//     <div>
//       <h2>Upload Sudoku Image</h2>
//       <input type="file" accept="image/*" onChange={handleImageUpload} />
//       <button onClick={extractSudoku} disabled={loading}>
//         {loading ? 'Extracting...' : 'Extract Sudoku'}
//       </button>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       {recognizedBoard && (
//         <div>
//           <h3>Recognized Sudoku Board:</h3>
//           <pre>{JSON.stringify(recognizedBoard, null, 2)}</pre>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SudokuExtractor;
