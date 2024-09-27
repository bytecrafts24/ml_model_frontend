// src/drawerItems.js
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import MovieIcon from '@mui/icons-material/Movie';
import GridOnIcon from '@mui/icons-material/GridOn';
import TransformIcon from '@mui/icons-material/Transform';

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
        label: "Pgn to Csv",
        icon: <ImageIcon />,
        path: "/pgn-to-csv",
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
        label: "Pgn",
        icon: <PictureAsPdfIcon />,
        path: "/pgn",
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
  
];
