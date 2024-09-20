import React, { useState } from 'react';
import {
  AppBar, Toolbar, IconButton, Button, Drawer, List, ListItem, ListItemText,
  Typography, Box, Collapse,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import TransformIcon from '@mui/icons-material/Transform';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import { Link } from 'react-router-dom';

const drawerWidth = 240;
const miniDrawerWidth = 70;

export default function Sidebar() {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [openConverter, setOpenConverter] = useState(true);

  const handleConverterToggle = () => {
    setOpenConverter(!openConverter);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" sx={{ zIndex: 1300, backgroundColor: '#ffffff' }}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6" noWrap style={{ color: '#000000' }}>
                Bytecrafts
              </Typography>
              <IconButton
                edge="start"
                color="#000000"
                aria-label="menu"
                onClick={toggleDrawer}
                sx={{ ml: 2 }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
            <Button color="inherit" startIcon={<AccountCircle />} style={{ color: '#000000' }}>
              Login
            </Button>
          </Toolbar>
        </AppBar>

        <Drawer
          variant="permanent"
          anchor="left"
          open={drawerOpen}
          sx={{
            width: drawerOpen ? drawerWidth : miniDrawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerOpen ? drawerWidth : miniDrawerWidth,
              transition: 'width 0.3s',
              overflowX: 'hidden',
              marginTop: '64px',
            },
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', paddingTop: 2, width: '100%' }}>
            <List>
              <ListItem button onClick={handleConverterToggle} sx={{ justifyContent: 'space-between', padding: '10px 16px' }}>
                <TransformIcon />
                {drawerOpen && <ListItemText primary="Converter" />}
                {openConverter ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>

              <Collapse in={openConverter} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem button component={Link} to="/pdf-to-jpg">
                    <PictureAsPdfIcon sx={{ mr: drawerOpen ? 1 : 0 }} />
                    {drawerOpen && <ListItemText primary="PDF to JPG" />}
                  </ListItem>

                  <ListItem button component={Link} to="/image-to-webp">
                    <ImageIcon sx={{ mr: drawerOpen ? 1 : 0 }} />
                    {drawerOpen && <ListItemText primary="Image to WebP" />}
                  </ListItem>
                </List>
              </Collapse>
            </List>
            <Divider/>
          </Box>
        </Drawer>
      </Box>
    </div>
  );
}
