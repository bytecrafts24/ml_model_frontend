import { Container, Box } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './layout/Sidebar';
import PdfToJpgConverter from './converters/PdfToJpg';
import ImageToWebPConverter from './converters/ImageToWebp';
import MovieRecommender from './MovieRecommender';
// import SudokuSolverComponent from './sudoku';
import PgnToCsvConverter from './converters/PgnToCsv';
import PgnMerger from './merger/Pgn'
import SudokuExtractorandSolver from './sudoku'
import QrCodeDecoder from './QrcodeGenerator/qrDecoder'
import QrCodeGenerator from './QrcodeGenerator/qrGenerator';
import ImageToBase64Converter from './base64Convertor/imageToBase64';
import Base64Decoder from './base64Convertor/base64decoder';

const appBarHeight = 64;

function App() {
  return (
    <Router>
      <Box display="flex" minHeight="100vh" flexDirection="column">

        <Box component="header">

        </Box>

        <Box display="flex" flexGrow={1}>
          <Sidebar />

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              padding: 2,
              overflow: 'hidden',
              backgroundColor: '#f0f0f0',
              marginTop: `${appBarHeight}px`,
              width: { xs: '100%', sm: 'calc(100% - 240px)' },

            }}
          >
            <Container maxWidth="lg">
              <Routes>
                <Route path="/pdf-to-jpg" element={<PdfToJpgConverter />} />
                <Route path="/image-to-webp" element={<ImageToWebPConverter />} />
                <Route path="/pgn-to-csv" element={<PgnToCsvConverter />} />
                <Route path="/pgn" element={<PgnMerger/>} />
                <Route path="/movie-recommender" element={<MovieRecommender/> }/>
                <Route path="/sudoku-solver" element={<SudokuExtractorandSolver/> }/>
                <Route path="/qr-generator" element={<QrCodeGenerator /> }/>
                <Route path="/qr-decoder" element={<QrCodeDecoder /> }/>
                <Route path="/image-base64" element={<ImageToBase64Converter/>}/>
                <Route path="/image-base64-decoder" element={<Base64Decoder/>}/>
              </Routes>
            </Container>
          </Box>
        </Box>
      </Box>
    </Router>
  );
}

export default App;


// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
