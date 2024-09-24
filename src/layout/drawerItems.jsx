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
    ],
  },
  {
    id: 2,
    label: "IMDB Recommender",
    icon: <MovieIcon />,
    path: "/movie-recommender",
  },
  {
    id: 3,
    label: "Sudoku Solver",
    icon: <GridOnIcon />,
    path: "/sudoku-solver",
  },
];
