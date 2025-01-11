// src/drawerItems.js
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import MovieIcon from '@mui/icons-material/Movie';
import GridOnIcon from '@mui/icons-material/GridOn';
import TransformIcon from '@mui/icons-material/Transform';
import QrCodeIcon from '@mui/icons-material/QrCode';

export const drawerItems = [
  {
    id: 1,
    label: "Converter",
    icon: <TransformIcon />,
    children: [
      {
        id: 1.1,
        label: "PDF to JPG",
        icon: <PictureAsPdfIcon />,
        path: "/pdf-to-jpg",
      },
      {
        id: 1.2,
        label: "Image to WebP",
        icon: <ImageIcon />,
        path: "/image-to-webp",
      },
      {
        id: 1.3,
        label: "PGN to CSV",
        icon: <ImageIcon />,
        path: "/pgn-to-csv",
      },
      {
        id: 1.4,
        label: "PDF to Word",
        icon: <PictureAsPdfIcon />,
        path: "/pdf-to-word",
      },
      {
        id: 1.5,
        label: "Word to PDF",
        icon: <PictureAsPdfIcon />,
        path: "/word-to-pdf",
      },
      {
        id: 1.6,
        label: "STL converter",
        icon: <PictureAsPdfIcon />,
        path: "/stlconverter",
      },
    ],
  },
  {
    id: 2,
    label: "Merger",
    icon: <TransformIcon />,
    children: [
      {
        id: 2.1,
        label: "PGN",
        icon: <PictureAsPdfIcon />,
        path: "/pgn",
      },
      {
        id: 2.2,
        label: "PDF",
        icon: <PictureAsPdfIcon />,
        path: "/pdf",
      },
    ],
  },
  {
    id: 3,
    label: "IMDB Recommender",
    icon: <MovieIcon />,
    path: "/movie-recommender",
  },
  {
    id: 4,
    label: "Sudoku Solver",
    icon: <GridOnIcon />,
    path: "/sudoku-solver",
  },
  {
    id: 5,
    label: "QR Code",
    icon: <TransformIcon />,
    children: [
      {
        id: 5.1,
        label: "QR Generator",
        icon: <QrCodeIcon />,
        path: "/qr-generator",
      },
      {
        id: 5.2,
        label: "QR Decoder",
        icon: <QrCodeIcon />,
        path: "/qr-decoder",
      },
    ],
  },
  {
    id: 6,
    label: "Base64 Converter",
    icon: <TransformIcon />,
    children: [
      {
        id: 6.1,
        label: "Base64 Converter",
        icon: <GridOnIcon />,
        path: "/image-base64",
      },
      {
        id: 6.2,
        label: "Base64 Decoder",
        icon: <GridOnIcon />,
        path: "/image-base64-decoder",
      },
    ],
  },
  {
    id: 7,
    label: "Download Emails",
    icon: <GridOnIcon />,
    path: "/downloademails-csv",
  },
  {
    id: 8,
    label: "Image Text Extractor",
    icon: <GridOnIcon />,
    path: "/image-text-extractor",
  },
  {
    id: 9,
    label: "Web Scraper",
    icon: <GridOnIcon />,
    path: "/price-scraper",
  },
  {
  id: 10,
    label: "Chat App",
    icon: <GridOnIcon />,
    path: "/chat-app",
  },

];

