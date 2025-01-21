import { Container, Box } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./layout/Sidebar";
import PdfToJpgConverter from "./converters/PdfToJpg";
import ImageToWebPConverter from "./converters/ImageToWebp";
import MovieRecommender from "./MovieRecommender";
// import SudokuSolverComponent from './sudoku';
import PgnToCsvConverter from "./converters/PgnToCsv";
import PgnMerger from "./merger/Pgn";
import SudokuSolver from "./sudoku";
import QrCodeDecoder from "./QrcodeGenerator/qrDecoder";
import QrCodeGenerator from "./QrcodeGenerator/qrGenerator";
import ImageToBase64Converter from "./base64Convertor/imageToBase64";
import Base64Decoder from "./base64Convertor/base64decoder";
import DownloadEmails from "./emailToCsv.jsx";
import DownloadEmailsComponent from "./emailToCsv.jsx";
import ImageTextExtractor from "./imageExtractor.jsx";
import MicButton from "./speechCommand/Microphone.jsx";
import PdfMerger from "./merger/Pdf.jsx";
import PdfToWordConverter from "./converters/PdfToWord.js";
import WordToPdfConverter from "./converters/WordToPdf.js";
import FileUpload from "./converters/fileUpload.js";
import Canvas from "./Canvas/Canvas.jsx";
import VideoChat from "./Call/VideoChat.jsx";
import ChatApp from "./chatApp.jsx";
// import VideoCall from "./videocalls/videoCall.jsx";
import Login from "./layout/auth/login.jsx";
import Register from "./layout/auth/register.jsx";
import Profile from "./layout/auth/profile.jsx";
import ProtectedRoute from "./layout/auth/protectedRoutes.jsx";
import ImageToSTL from "./img_to_stl.jsx";
import ImageGenerator from "./Imagegenerator.jsx";


const appBarHeight = 64;
const WS_URL = "ws://localhost:3000";
function App() {
  return (
    <Router>
      <Box display="flex" minHeight="100vh" flexDirection="column">
        <Box component="header"></Box>

        <Box display="flex" flexGrow={1}>
          <Sidebar />

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              padding: 2,
              overflow: "hidden",
              backgroundColor: "#f0f0f0",
              marginTop: `${appBarHeight}px`,
              width: { xs: "100%", sm: "calc(100% - 240px)" },
            }}
          >
            <Container maxWidth="lg">
              <Routes>
                <Route path="/pdf-to-jpg" element={<PdfToJpgConverter />} />
                <Route path="/pdf-to-word" element={<PdfToWordConverter />} />
                <Route path="/word-to-pdf" element={<WordToPdfConverter />} />
                <Route
                  path="/image-to-webp"
                  element={<ImageToWebPConverter />}
                />
                <Route path="/pgn-to-csv" element={<PgnToCsvConverter />} />
                <Route path="/stlconverter" element={<FileUpload />} />
                <Route path="/pgn" element={<PgnMerger />} />
                <Route path="/pdf" element={<PdfMerger />} />
                <Route
                  path="/movie-recommender"
                  element={<MovieRecommender />}
                />
                <Route path="/sudoku-solver" element={<SudokuSolver />} />
                <Route path="/qr-generator" element={<QrCodeGenerator />} />
                <Route path="/qr-decoder" element={<QrCodeDecoder />} />
                <Route
                  path="/image-base64"
                  element={<ImageToBase64Converter />}
                />
                <Route
                  path="/image-base64-decoder"
                  element={<Base64Decoder />}
                />
                <Route
                  path="/downloademails-csv"
                  element={<DownloadEmailsComponent />}
                />
                <Route
                  path="/image-text-extractor"
                  element={<ImageTextExtractor />}
                />
                <Route path="/canvas" element={<Canvas wsUrl={WS_URL} />} />
                <Route
                  path="/canvas/:sessionId"
                  element={<Canvas wsUrl={WS_URL} />}
                />
                <Route path="/video" element={<VideoChat />} />
                <Route path="/video/:roomId" element={<VideoChat />} />
                <Route path="/chat-app" element={<ChatApp />} />
                <Route path="/img-stl" element={<ImageToSTL />} />
                <Route path="/img-generate" element={<ImageGenerator />} />
              </Routes>

              <MicButton />
            </Container>
          </Box>
        </Box>
      </Box>
    </Router>
  );
}

export default App;


// export default App;

// import React from "react";
// import Navbar from "./components/navbar.jsx";
// import SearchBar from "./components/searchbar.jsx";
// import Tools from "./components/tools.jsx";

// const data = {
//   appTitle: "ByteCrafts",
//   navLinks: [
//     { name: "Converter", href: "#" },
//     { name: "Merger", href: "#" },
//     { name: "Tools", href: "#" },
//   ],
//   tools: [
//     { name: "QR Generator", description: "QR Code generator" },
//     { name: "QR Decoder", description: "QR Code Decoder" },
//     { name: "IMDB Recommender", description: "IMDB Recommender" },
//     { name: "Sudoku Solver", description: "QR Code Decoder" },
//     { name: "Image Text Extractor", description: "Image Text Extractor" },
//   ],
// };

// const App = () => {
//   return (
//     <div className="min-h-screen text-gray-800 bg-gray-100">
//       <Navbar appTitle={data.appTitle} navLinks={data.navLinks} />
//       <SearchBar />
//       <Tools tools={data.tools} />
//     </div>
//   );
// };

// export default App;

